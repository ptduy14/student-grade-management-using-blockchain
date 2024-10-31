This intruction using geth 1.13.14-stable for PoA consensus

## Run bootnode:
`bootnode -nodekey boot.key -verbosity 9 -addr :30305`

- **bootnode**: Đây là công cụ khởi tạo một bootnode, chịu trách nhiệm quản lý và duy trì danh sách các nút tham gia mạng. Bootnode không thực hiện bất kỳ chức năng đào hoặc chạy smart contract nào mà chỉ đóng vai trò làm điểm khởi đầu để các nút khác kết nối.

- -**nodekey boot.key**: Chỉ định tệp khóa riêng tư (boot.key) của bootnode. Khóa này được sử dụng để xác định duy nhất bootnode trong mạng.

- -**verbosity 9**: Thiết lập mức độ chi tiết của các thông báo log từ bootnode. Mức 9 là mức cao nhất, ghi lại tất cả các sự kiện chi tiết từ hoạt động của bootnode.

- -**addr :30305**: Xác định địa chỉ mà bootnode lắng nghe các kết nối. 30305 là cổng mà bootnode sẽ mở để các nút khác kết nối. Ở đây, địa chỉ : chỉ ra rằng bootnode sẽ chấp nhận kết nối từ bất kỳ địa chỉ IP nào (bạn có thể thay đổi thành địa chỉ IP cụ thể nếu cần).

## Run node1:
`geth --datadir ./node1 --networkid 12345 --port 30306 --http --http.addr "127.0.0.1" --http.port 8545 --http.api "personal,eth,net,web3,txpool,miner,admin" --http.corsdomain "http://localhost:8000, https://remix.ethereum.org" --allow-insecure-unlock --authrpc.port 8551 --bootnodes enode://283c7444a679a81b39d6727f2cfd09d4b54a9f86b21bbf6bf46ecebb02883e400f2b51088c0f56d1c9602667aae9dec4fcc928543894c3f4b644259d28ae45ed@127.0.0.1:0?discport=30305 --unlock 0xD91E59effa1757393191dA2Ba3582dE1d92D90ce --password node1/password.txt --miner.etherbase 0xD91E59effa1757393191dA2Ba3582dE1d92D90ce --mine --ipcpath ./node1/geth.ipc
`

geth: Đây là client chính của Ethereum (Go Ethereum), chịu trách nhiệm chạy một node của blockchain.

- **--datadir ./node1**: Chỉ định thư mục dữ liệu của node 1. Đây là nơi lưu trữ tất cả các dữ liệu của blockchain và tài khoản của node 1.

- **--networkid 12345:** Chỉ định ID của mạng riêng (private network). Mỗi mạng Ethereum có một networkid riêng, và 12345 chỉ định mạng của bạn là một mạng tùy chỉnh, không xung đột với mạng chính của Ethereum.

- **--port 30306:** Cổng P2P mà node 1 sử dụng để kết nối với các nút khác. Cổng này được sử dụng cho giao tiếp giữa các node Ethereum.

- **--http:** Kích hoạt HTTP-RPC API cho phép tương tác với node thông qua HTTP.

- **--http.addr "127.0.0.1":** Địa chỉ IP mà node sẽ lắng nghe yêu cầu HTTP. Ở đây, chỉ có máy local (127.0.0.1) mới có thể kết nối với node này qua HTTP.

- **--http.port 8545:** Cổng HTTP mà node sử dụng để lắng nghe các yêu cầu từ client (như web3.js).

- **--http.api "personal,eth,net,web3,txpool,miner,admin"**: Chỉ định các API mà HTTP-RPC cung cấp, bao gồm:

    - personal: Quản lý tài khoản cá nhân.
    - eth: Các thao tác liên quan đến blockchain và giao dịch Ethereum.
    - net: Thông tin về mạng.
    - web3: Thông tin về kết nối Web3.
    - txpool: Quản lý pool giao dịch.
    - miner: Các chức năng đào.
    - admin: Các chức năng quản trị node.

- **--http.corsdomain "http://localhost:8000, https://remix.ethereum.org"**: Các miền được phép truy cập vào RPC server, bao gồm địa chỉ localhost của bạn và Remix IDE.

- **--allow-insecure-unlock**: Cho phép mở khóa tài khoản thông qua RPC (không khuyến nghị cho các mạng công khai, nhưng được sử dụng trong môi trường private).

- **--authrpc.port 8551:** Chỉ định cổng cho các yêu cầu RPC có xác thực. Thường được dùng để quản lý các giao dịch và giao tiếp an toàn hơn.

- **--bootnodes enode://283c...ed@127.0.0.1:0?discport=30305:** Chỉ định địa chỉ của bootnode mà node 1 sẽ kết nối để tìm các nút khác trong mạng. Địa chỉ enode là mã nhận dạng của bootnode và discport=30305 chỉ định cổng discovery mà bootnode đang lắng nghe.

- **--unlock 0xD91E59...90ce:** Mở khóa tài khoản có địa chỉ 0xD91E59...90ce để có thể thực hiện các giao dịch mà không cần yêu cầu mật khẩu mỗi lần.

- **--password node1/password.txt:** Tệp chứa mật khẩu để mở khóa tài khoản.

- **--miner.etherbase 0xD91E59...90ce:** Chỉ định tài khoản nhận phần thưởng khi node thực hiện quá trình mining (đào).

- **--mine:** Bật chế độ mining trên node này. Node sẽ bắt đầu khai thác các block.

- **--ipcpath ./node1/geth.ipc:** Đường dẫn tệp IPC (Inter-process communication) của node. Tệp này được sử dụng để giao tiếp với các công cụ như geth console hoặc các ứng dụng khác chạy trên cùng hệ thống.

## Run node2:
`geth --datadir ./node2 --networkid 12345 --port 30307 --http --http.addr "127.0.0.1" --http.port 8546 --http.api "personal,eth,net,web3,txpool,miner,admin" --allow-insecure-unlock --authrpc.port 8552 --bootnodes enode://283c7444a679a81b39d6727f2cfd09d4b54a9f86b21bbf6bf46ecebb02883e400f2b51088c0f56d1c9602667aae9dec4fcc928543894c3f4b644259d28ae45ed@127.0.0.1:0?discport=30305 --unlock 0x6A8BfbB0fA3CC059815fEAF433B905772274C652 --password node2/password.txt --ipcpath ./node2/geth.ipc
`
Lệnh này tương tự như node1, chỉ có một số điểm khác biệt:

- **--datadir ./node2:** Dữ liệu của node 2 được lưu trong thư mục ./node2.

- **--port 30307:** Node 2 sử dụng cổng P2P khác là 30307 để kết nối với các nút khác.

- **--http.port 8546:** Cổng HTTP của node 2 là 8546 (khác với 8545 của node 1).

- **--authrpc.port 8552:** Cổng RPC có xác thực của node 2 là 8552.

- **--unlock 0x6A8BfbB...772274C652:** Địa chỉ tài khoản mở khóa của node 2 khác với node 1.

- **--password node2/password.txt:** Tệp mật khẩu của node 2.

- **--ipcpath ./node2/geth.ipc:** Đường dẫn IPC của node 2.

# Tham khảo


Go Ethereum Documentation : End-to-end example

* https://github.com/LifnaJos/Private-Ethereum-Blockchain-setup-using-Geth

* [Go Ethereum Documentation : End-to-end example](https://geth.ethereum.org/docs/fundamentals/private-network#end-to-end-example)

* [Go Ethereum - Github Developers Community](https://github.com/ethereum/go-ethereum/issues/27850) for helping me in resolving the issues in performing the mining on Private Ethereum Network setup using Geth.
