import express from "express";
const app = express();
const port = 5001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

let data = '';
data = '02243B202020203031302020203031300D';
//data = '022431202020203034362020203031300D';
//data = '022439202020203030342020203031300D';
//data = '022439202020203035362020203030300D';



class Weight {
    net = 0.0;
    tare = 0.0;
    gross = 0.0;
    unit = 0;
    unstable = 0;
    out_of_range = 0;
    motion = 0;
}

class Balance {
    id = 0;
    model = 0;
    time = 0;
    weight = new Weight();

    constructor() {
    }
}

class Wildcat_Mettler_Toledo {

    commands = {
        clear: { command: 'C', function: 'Clear', description: 'Clear Tare Value' },
        tare: { command: 'T', function: 'Tare', description: 'Performs a pushbutton tare' },
        print: { command: 'P', function: 'Print', description: 'Transmit data or set print bit in continuous output' },
        print_stable: { command: 'S', function: 'Print Stable', description: 'Transmit data or set print bit in continuous output' },
        zero: { command: 'Z', function: 'Zero', description: 'Zero the scale (if within range and no-motion)' },
    };

    constructor() {
        this.weight = new Weight();
    };

    // PUBLIC
    decodeContinuousFormat(data) {
        //let weight = { tare: 0, net: 0, gross: 0, unit: 0, unstable: 0 };
        let decode_data = data.substring(
            data.indexOf("02") + 2,
            data.lastIndexOf("0D")
        );
        if (/([0-9a-fA-F]{2}){15}/.test(decode_data)) {
            let buffer = Buffer.from(decode_data, "hex");
            console.log(buffer);
            let buffer_status = buffer.slice(0, 2);
            let buffer_weight = buffer.slice(3, 8);
            let buffer_tare = buffer.slice(9, 16);

            this.weight.tare = this.#dummy_zero_or_decimal_position(buffer_status[0], buffer_tare);

            if (buffer_status[1] & 0x01 === 0x01) {
                this.weight.net = this.#dummy_zero_or_decimal_position(buffer_status[0], buffer_weight);
                this.weight.net *= ((buffer_status[1] & 0x02) === 0x02 ? -1 : 1);
                this.weight.gross = Number((this.weight.net + this.weight.tare).toFixed(2));
            }
            else {
                this.weight.gross = this.#dummy_zero_or_decimal_position(buffer_status[0], buffer_weight);
                this.weight.gross *= ((buffer_status[1] & 0x02) === 0x02 ? -1 : 1);
                this.weight.net = Number((this.weight.gross - this.weight.tare).toFixed(2));
            }
            this.weight.unit = ((buffer_status[1] & 0x10) === 0x10 ? 1 : 0);
            this.weight.out_of_range = ((buffer_status[1] & 0x04) === 0x04 ? 1 : 0);
            this.weight.motion = ((buffer_status[1] & 0x08) === 0x08 ? 1 : 0);
        }
        console.log(this.weight);
        //return weight;
    };

    // PRIVATE
    #dummy_zero_or_decimal_position(type, buffer) {
        let output = 0;
        switch (type % 8) {
            case 0:
                buffer[4] = 0x30;
                buffer[5] = 0x30;
                output = Number(buffer.toString().trim());
                break;
            case 1:
                buffer_tare[5] = 0x30;
                output = Number(buffer.toString().trim());
                break;
            case 2:
                output = Number(buffer.toString().trim());
                break;
            case 3:
                output = Number(buffer.toString().trim());
                output *= 0.1;
                break;
            case 4:
                output = Number(buffer.toString().trim());
                output *= 0.01;
                break;
            case 5:
                output = Number(buffer.toString().trim());
                output *= 0.001;
                break;
            case 6:
                output = Number(buffer.toString().trim());
                output *= 0.0001;
                break;
            case 7:
                output = Number(buffer.toString().trim());
                output *= 0.00001;
                break;
        }
        return output;
    }
};

const wildcat = new Wildcat_Mettler_Toledo();
var output = wildcat.decodeContinuousFormat(data);

app.get('/', function (req, res) {
    res.send('Hola pendejos');
});

app.listen(port, function () {
    console.log(`Example app listening at http://localhost:${port}`);
});

