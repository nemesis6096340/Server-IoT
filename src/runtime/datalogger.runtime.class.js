import ModbusRTU from "modbus-serial";

const ADDRESS_MODBUS_DATALOGGER = 300;

var networkErrors = [
    "ESOCKETTIMEDOUT",
    "ETIMEDOUT",
    "ECONNRESET",
    "ECONNREFUSED",
    "EHOSTUNREACH",
    "ENETRESET",
    "ECONNABORTED",
    "ENETUNREACH",
    "ENOTCONN",
    "ESHUTDOWN",
    "EHOSTDOWN",
    "ENETDOWN",
    "EWOULDBLOCK",
    "EAGAIN"
];

class modbus_client{    

    constructor(id, ip, port){
        this.id = id;
        this.ip = ip;
        this.port = port;
        this.client = new ModbusRTU();
        this.timeoutRunRef = null;
        this.timeoutConnectRef = null;
    };

    connect(){
        console.log("Connecting...");
        // clear pending timeouts
        clearTimeout(this.timeoutConnectRef);

        // if client already open, just run
        if (this.client.isOpen) {
            console.log("Client open");
            this.run();
        }

        // if client closed, open a new connection
        this.client.connectTCP(this.ip, { port: this.port })
            .then(this.setClient.bind(this))
            .then(function() {
                console.log(new Date().toISOString(), "Connected"); })
            .catch(function(e) {
                console.log("Error connect client");
                console.log(new Date().toISOString(), e.message);
                this.checkError(e).bind(this);
            }.bind(this));
    };

    setClient() {
        // set the client's unit id
        // set a timout for requests default is null (no timeout)
        this.client.setID(this.id);
        this.client.setTimeout(5000);
        console.log("Set Client...");
        // run program
        this.run();
    };

    run() {
        console.log("Run...");
        // clear pending timeouts
        console.log("Id: " + this.id);
        //console.log("timeoutRunRef: "+this.timeoutRunRef);
        clearTimeout(this.timeoutRunRef);
        
        // read the 4 registers starting at address 5
        this.client.readInputRegisters(ADDRESS_MODBUS_DATALOGGER, 16)
            .then(function(d) {                
                console.log(new Date().toISOString(), "Receive:", d.data);
                })
            .then(function() {
                console.log("Id: " + this.id);
                //console.log("timeoutRunRef: " + this.timeoutRunRef);
                this.timeoutRunRef = setTimeout(this.run.bind(this), 1000);
                //console.log(this.timeoutRunRef);
            }.bind(this))                
            .catch(function(e) {
                console.log("Error Run...");
                console.log(new Date().toISOString(), e.message);
                this.checkError(e);
            }.bind(this));
    };

    checkError(e) {
        if(e.errno && networkErrors.includes(e.errno)) {
            console.log(new Date().toISOString(), "we have to reconnect");
    
            // close port
            this.client.close();
    
            // re open client
            this.client = new ModbusRTU();
            this.timeoutConnectRef = setTimeout(this.connect.bind(this), 0);
        }
    };
    
};


var client1 = new modbus_client(11,'10.0.103.22',123);
client1.connect();