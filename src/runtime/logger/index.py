import time
from pyModbusTCP.client import ModbusClient

client = ModbusClient(host="10.0.103.73", port=123, unit_id=63, auto_open=True, timeout=2)

# main read loop
while True:
    # read 10 registers at address 0, store result in regs list
    regs_l = client.read_input_registers(300, 2)

    # if success display registers
    if regs_l:
        print('reg ad #0 to 2: %s' % regs_l)
    else:
        print('unable to read registers')

    # sleep 2s before next polling
    time.sleep(2)