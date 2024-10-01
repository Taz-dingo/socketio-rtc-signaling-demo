# Minimal WebRTC Implementation / WebRTC视频通信最小实现

<details>
<summary>English</summary>

This project is a minimal implementation of WebRTC video communication based on Socket.IO, WebRTC, and Next.js.

## Features

- Real-time video calling
- Room-based communication
- Peer-to-peer connections using WebRTC
- Signaling via Socket.IO

## Tech Stack

- Next.js
- Socket.IO
- WebRTC API

## Quick Start

1. Install dependencies:

```bash
npm install
```

2. Run the development server:

```bash
npm run dev
```

3. Open `http://localhost:3000` in your browser

## Core Processes

The WebRTC communication process primarily consists of the following stages:

1. Joining a room
2. Media negotiation
3. ICE candidate exchange
4. Establishing peer-to-peer connection

### Sequence Diagram

```mermaid
sequenceDiagram
    participant Client1
    participant Server
    participant Client2

    Client1->>Server: Join room
    Server->>Client1: Confirm join
    Client2->>Server: Join room
    Server->>Client2: Confirm join
    Server->>Client1: Notify new user joined

    Client1->>Client1: Create RTCPeerConnection
    Client1->>Client1: Get local media stream
    Client1->>Client1: Add media tracks to RTCPeerConnection
    Client1->>Client1: Create Offer
    Client1->>Server: Send Offer
    Server->>Client2: Forward Offer

    Client2->>Client2: Create RTCPeerConnection
    Client2->>Client2: Set remote description (Offer)
    Client2->>Client2: Get local media stream
    Client2->>Client2: Add media tracks to RTCPeerConnection
    Client2->>Client2: Create Answer
    Client2->>Server: Send Answer
    Server->>Client1: Forward Answer

    Client1->>Client1: Set remote description (Answer)

    Client1->>Server: Send ICE candidates
    Server->>Client2: Forward ICE candidates
    Client2->>Server: Send ICE candidates
    Server->>Client1: Forward ICE candidates

    Client1-->>Client2: Establish peer-to-peer connection
```

## Contributing

Issues and pull requests are welcome.

## License

[MIT](https://choosealicense.com/licenses/mit/)

</details>

<details>
<summary>中文</summary>

这个项目是基于Socket.IO、WebRTC和Next.js的WebRTC视频通信最小实现。

## 功能特点

- 实时视频通话
- 基于房间的通信
- 使用WebRTC进行点对点连接
- 使用Socket.IO进行信令

## 技术栈

- Next.js
- Socket.IO
- WebRTC API

## 快速开始

1. 安装依赖:

```bash
npm install
```

2. 运行开发服务器:

```bash
npm run dev
```

3. 在浏览器中打开 `http://localhost:3000`

## 核心过程

WebRTC通信过程主要包括以下几个阶段:

1. 进入房间
2. 媒体协商
3. ICE候选交换
4. 建立点对点连接

### 时序图

```mermaid
sequenceDiagram
    participant Client1
    participant Server
    participant Client2

    Client1->>Server: 加入房间
    Server->>Client1: 确认加入
    Client2->>Server: 加入房间
    Server->>Client2: 确认加入
    Server->>Client1: 新用户加入通知

    Client1->>Client1: 创建RTCPeerConnection
    Client1->>Client1: 获取本地媒体流
    Client1->>Client1: 添加媒体轨道到RTCPeerConnection
    Client1->>Client1: 创建Offer
    Client1->>Server: 发送Offer
    Server->>Client2: 转发Offer

    Client2->>Client2: 创建RTCPeerConnection
    Client2->>Client2: 设置远程描述(Offer)
    Client2->>Client2: 获取本地媒体流
    Client2->>Client2: 添加媒体轨道到RTCPeerConnection
    Client2->>Client2: 创建Answer
    Client2->>Server: 发送Answer
    Server->>Client1: 转发Answer

    Client1->>Client1: 设置远程描述(Answer)

    Client1->>Server: 发送ICE候选
    Server->>Client2: 转发ICE候选
    Client2->>Server: 发送ICE候选
    Server->>Client1: 转发ICE候选

    Client1-->>Client2: 建立点对点连接
```

## 贡献

欢迎提交问题和拉取请求。

## 许可证

[MIT](https://choosealicense.com/licenses/mit/)

</details>

