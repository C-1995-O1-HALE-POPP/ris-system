import socket
import numpy as np
import time
import uuid
import queue
import threading
from dataclasses import dataclass
from typing import Optional, Union
import sounddevice as sd
import os
import wave

# 配置部分
TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTc1MjEyMzgzMiwianRpIjoiNTNhZWVjNjYtY2NkYy00MGJiLTlhMmItYTFiYjVkNGUzMWE0IiwidHlwZSI6ImFjY2VzcyIsInN1YiI6IlVZMkZFUDk3MzUxYzljMGIxZDQ0Y2E4NWNhNjNjNDhmZTgzNGJkIiwibmJmIjoxNzUyMTIzODMyLCJjc3JmIjoiNWEzMTNjNGUtYTVjYi00ZGZhLWFhNDctODk0NjhlY2Q4NTlmIiwiZXhwIjoxNzUyMTM4MjMyfQ.VVopd6pePxui62fhNEeb4KIqzSegIHAV7KZagXQNYUI"  # 请在这里填入你的token
#HOST = "127.0.0.1"
HOST = "ai.depthsdata.com"
PORT = 8009
VOICE_ID = "Chinese (Mandarin)_Wise_Women"

START_MARK = b'##START'
END_MARK = b'##END'

@dataclass
class Frame:
    """消息帧数据类"""
    msg_type: int
    task_id: str
    seq_num: str
    content: Union[str, bytes]

class AudioPlayer:
    """音频播放器类"""
    def __init__(self):
        self.sample_rate = 16000
        self.audio_buffer = np.array([], dtype=np.int16)
        self.running = True
        self.current_task_id = None
        
        # 创建持续运行的音频流
        self.stream = sd.OutputStream(
            samplerate=self.sample_rate,
            channels=1,
            dtype=np.int16,
            callback=self._audio_callback,
            finished_callback=None
        )
        # 控制缓冲区大小的参数
        self.buffer_size = 3200  # 每次回调请求的数据量（200ms）
        self.lock = threading.Lock()
        
        # 静音检测参数
        self.silence_threshold = 150  # 静音阈值，低于此值被视为静音
        self.skip_silence = True  # 是否跳过初始静音

    def start(self):
        """启动音频流"""
        self.stream.start()

    def stop(self):
        """停止音频流"""
        self.running = False
        self.stream.stop()
        self.stream.close()

    def play_audio(self, task_id: str, audio_data: bytes):
        """添加音频数据到缓冲区"""
        if self.current_task_id != task_id:
            print(f"新的音频任务: {task_id}")
            self._reset_state()
            self.current_task_id = task_id
            self.skip_silence = True  # 新任务重置静音跳过状态

        # 将新的音频数据添加到缓冲区
        audio_array = np.frombuffer(audio_data, dtype=np.int16)
        
        # 如果需要跳过静音
        if self.skip_silence and len(audio_array) > 0:
            # 计算音频振幅的绝对值
            abs_audio = np.abs(audio_array)
            # 查找第一个非静音样本的索引
            non_silence_indices = np.where(abs_audio > self.silence_threshold)[0]
            if len(non_silence_indices) > 0:
                # 找到非静音起始点
                first_sound_idx = non_silence_indices[0]
                if first_sound_idx > 0:
                    print(f"跳过开头 {first_sound_idx/self.sample_rate:.2f}秒 的静音")
                    audio_array = audio_array[first_sound_idx:]
                self.skip_silence = False  # 已找到声音，不再跳过
        
        with self.lock:
            self.audio_buffer = np.concatenate([self.audio_buffer, audio_array])

    def _reset_state(self):
        """重置播放器状态"""
        with self.lock:
            self.audio_buffer = np.array([], dtype=np.int16)
            self.current_task_id = None
            self.skip_silence = True  # 重置时启用静音跳过

    def _audio_callback(self, outdata, frames, time, status):
        """音频流回调函数"""
        if status:
            print(f'音频状态: {status}')
        
        with self.lock:
            if len(self.audio_buffer) >= frames:
                # 有足够的数据，发送并移除已播放的部分
                outdata[:] = self.audio_buffer[:frames].reshape(-1, 1)
                self.audio_buffer = self.audio_buffer[frames:]
            else:
                # 数据不足，用静音填充
                outdata[:] = np.zeros((frames, 1), dtype=np.int16)

class TCPClient:
    """TCP客户端类"""
    def __init__(self):
        self.sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.audio_player = AudioPlayer()
        self.running = True
        self.audio_buffer = bytearray()
        self.recv_buffer = bytearray()  # 新增接收缓冲区
        self.task_id = "task0001"        
        self.recv_seq_num = -1
        
        # 新增音频保存相关的属性
        self.audio_save_buffer = bytearray()  # 用于保存完整的音频数据
        self.audio_dir = os.path.join('tests', 'audio')
        os.makedirs(self.audio_dir, exist_ok=True)  # 确保音频目录存在

    def connect(self):
        """连接服务器并认证"""
        self.sock.connect((HOST, PORT))
        print("已连接到服务器")
        
        # 发送认证消息
        auth_content = f"{TOKEN}##voiceid:{VOICE_ID}##lang:chinese##format:pcm"
        auth_frame = self._create_frame(1, "00000000", "0000", auth_content)
        self.sock.send(auth_frame)
        print("已发送认证信息")
        
    def start(self):
        """启动接收和发送线程"""
        self.audio_player.start()
        self.receiver_thread = threading.Thread(target=self._receiver_thread, daemon=True)
        self.sender_thread = threading.Thread(target=self._sender_thread, daemon=True)
        
        self.receiver_thread.start()
        self.sender_thread.start()
        
    def stop(self):
        """停止所有线程"""
        self.running = False
        self.audio_player.stop()
        self.sock.close()
        
    def _create_frame(self, msg_type: int, task_id: str, seq_num: str, content: Union[str, bytes]) -> bytes:
        """创建消息帧"""
        frame = bytearray()
        frame.extend(START_MARK)
        # 添加消息类型 (1-5)
        frame.extend(bytes([msg_type]))
        # 添加其他内容
        frame.extend(task_id.encode().ljust(8))
        frame.extend(seq_num.zfill(4).encode())
        if content:
            frame.extend(content if isinstance(content, bytes) else content.encode())
        # 添加帧结束标记
        frame.extend(END_MARK)
        return frame
        
    def _parse_frame(self, frame_data: bytes) -> Optional[Frame]:
        """解析消息帧"""
        try:
            msg_type = frame_data[0]  # 直接使用第一个字节作为消息类型
            if msg_type not in range(1, 6):  # 检查是否是有效的消息类型 (1-5)
                return None
                
            task_id = frame_data[1:9].decode()            
            seq_num = frame_data[9:13].decode()            
            content = frame_data[13:]            
            
            if task_id == self.task_id:
                print(f"收到帧 - msg_type: {msg_type}, task_id: {task_id}, seq_num: {seq_num}")
                return Frame(msg_type, task_id, seq_num, content)
            return None
        except Exception as e:            
            print(f"解析帧错误: {e}")
            return None
            
    def _receiver_thread(self):
        """接收线程"""        
        VALID_HEADERS = set([bytes([i]) for i in range(1, 6)])  # b'\x01' 到 b'\x05'
        
        while self.running:
            try:
                data = self.sock.recv(1024)
                if not data:
                    time.sleep(0.1)
                    continue
                
                # 将新数据添加到接收缓冲区
                self.recv_buffer.extend(data)
                
                while len(self.recv_buffer) >= (len(START_MARK) + len(END_MARK) + 13):  # 最小帧长度
                    # 查找起始标记
                    try:
                        start_index = self.recv_buffer.index(START_MARK)
                    except ValueError:
                        # 没找到起始标记，清空缓冲区
                        break
                    
                    # 如果起始标记前有数据，丢弃
                    if start_index > 0:
                        print(f"丢弃起始标记前的数据: {start_index} 字节")
                        self.recv_buffer = self.recv_buffer[start_index:]
                    
                    # 在起始标记之后查找结束标记
                    try:
                        end_index = self.recv_buffer.index(END_MARK, len(START_MARK))
                    except ValueError:
                        # 没找到结束标记，保留起始标记及之后的数据
                        break
                    
                    # 提取帧内容（不包括起始和结束标记）
                    frame_data = self.recv_buffer[len(START_MARK):end_index]
                    
                    # 验证帧格式
                    if len(frame_data) >= 13 and bytes([frame_data[0]]) in VALID_HEADERS:
                        try:
                            frame = self._parse_frame(frame_data)
                            if frame:
                                self._handle_frame(frame)
                        except Exception as e:
                            print(f"帧解析错误: {e}")
                    else:
                        print(f"无效帧格式或长度不足: 长度={len(frame_data)}, 帧头={hex(frame_data[0]) if frame_data else 'None'}")
                    
                    # 移除已处理的数据（包括结束标记）
                    self.recv_buffer = self.recv_buffer[end_index + len(END_MARK):]
                    
            except Exception as e:
                print(f"接收错误: {e}")
                break
                
    def _save_audio_to_wav(self):
        """将音频数据保存为WAV文件"""
        if not self.audio_save_buffer:
            return
            
        filename = os.path.join(self.audio_dir, f'{self.task_id}.wav')
        with wave.open(filename, 'wb') as wav_file:
            wav_file.setnchannels(1)  # 单声道
            wav_file.setsampwidth(2)  # 16位音频
            wav_file.setframerate(16000)  # 采样率
            wav_file.writeframes(self.audio_save_buffer)
        print(f"\n音频已保存至: {filename}")
        self.audio_save_buffer = bytearray()  # 清空缓冲区

    def _handle_frame(self, frame: Frame):        
        """处理接收到的消息帧"""
        if frame.msg_type == 4:  # TEXT
            print(f"\n文本响应: {frame.content.decode('utf-8', errors='ignore')}")
        elif frame.msg_type == 2:  # AUDIO_FRAME
            # 将音频数据添加到播放队列
            self.audio_player.play_audio(frame.task_id, frame.content)
            # 同时保存到文件缓冲区
            self.audio_save_buffer.extend(frame.content)
        elif frame.msg_type == 3:  # END_FRAME
            # 保存完整的音频文件
            self._save_audio_to_wav()
        elif frame.msg_type == 5:  # STATUS
            print(f"\n状态消息: {frame.content.decode('utf-8', errors='ignore')}")
            
    def _sender_thread(self):
        """发送线程"""
        while self.running:
            try:
                user_input = input("\n请输入消息（输入'quit'退出，输入'exit'主动断开连接）: ")
                if user_input.lower() == 'quit':
                    self.stop()
                    break
                elif user_input.lower() == 'exit':
                    # 发送主动断开连接消息
                    print("发送主动断开连接消息...")
                    disconnect_frame = self._create_frame(5, "00000000", "0000", "##DISCONNECT")
                    self.sock.send(disconnect_frame)
                    print("已发送断开连接消息")
                    # 等待一小段时间让服务器处理
                    time.sleep(10)
                    self.stop()
                    break
                    
                self.task_id = uuid.uuid4().hex[:8]
                self.recv_seq_num = -1

                # 发送文本消息
                text_frame = self._create_frame(4, self.task_id, "0000", user_input)
                self.sock.send(text_frame)                
                
                # 发送结束帧
                end_frame = self._create_frame(3, self.task_id, "0001", "")
                self.sock.send(end_frame)                
                
            except Exception as e:
                print(f"发送错误: {e}")
                break

def main():
    client = TCPClient()
    try:
        client.connect()
        client.start()
        
        # 等待发送线程结束
        client.sender_thread.join()
    except Exception as e:
        print(f"错误: {e}")
    finally:
        client.stop()
        print("\n连接已关闭")

if __name__ == "__main__":
    main()
