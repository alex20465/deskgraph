import { Injectable } from '@nestjs/common';
import { Bluetooth, factory } from 'deskbluez';
import { AbstractDesk, DeskState } from 'deskbluez/dist/desks/AbstractDesk';
import { ConfigManager } from 'deskbluez/dist/lib/config';
import { Desk } from './models';

const { BLUETOOTH_ADAPTER = 'hci0' } = process.env;

@Injectable()
export class DeskService {
  private bluetooth = new Bluetooth();

  constructor() {
    this.bluetooth.init(BLUETOOTH_ADAPTER);
  }

  public get(profile: string): Desk {
    const config = new ConfigManager(profile);
    const desk = config.getConnectedDevice();

    return {
      name: desk.name,
      profile: profile,
      address: desk.address,
    };
  }

  public async getState(profile: string): Promise<DeskState> {
    const desk = await this.connectDevice(profile);
    return desk.state();
  }

  public async up(profile: string) {
    const desk = await this.connectDevice(profile);
    return desk.up();
  }

  public async down(profile: string) {
    const desk = await this.connectDevice(profile);
    return desk.down();
  }

  private async connectDevice(profile: string): Promise<AbstractDesk> {
    const config = new ConfigManager(profile);
    const { address, modelName } = config.getConnectedDevice();
    const model = factory.getDeskModel(modelName);
    await this.bluetooth.startDiscovery();
    const bluetoothDevice = await this.bluetooth.connect(address);
    await this.bluetooth.stopDiscovery();
    const desk = factory.createDesk(model, bluetoothDevice);
    await desk.connect();
    return desk;
  }
}
