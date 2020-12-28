import { Injectable } from '@nestjs/common';
import { Bluetooth, DiscoveredDevice, factory } from 'deskbluez';
import {
  AbstractDesk,
  DeskState,
  DESK_EVENT,
  LENGTH_UNITS,
} from 'deskbluez/dist/desks/AbstractDesk';
import { DeskModelItem } from 'deskbluez/dist/desks/types';
import { ConfigManager } from 'deskbluez/dist/lib/config';
import REGISTRY from 'deskbluez/dist/REGISTRY';
import { EventEmitter } from 'ws';
import { Desk } from './models';

const { BLUETOOTH_ADAPTER = 'hci0' } = process.env;

@Injectable()
export class DeskbluezService {
  private bluetooth = new Bluetooth();

  private connectedDevices: { [key: string]: AbstractDesk } = {};

  private stateChangeEmitter: EventEmitter = new EventEmitter();

  constructor() {
    this.init().then(() => console.log('done'));
  }

  private init = async () => {
    await this.bluetooth.init(BLUETOOTH_ADAPTER);
  };

  public get(profile: string): Desk {
    const config = new ConfigManager(profile);
    const desk = config.getConnectedDevice();

    return {
      name: desk.name,
      profile: profile,
      address: desk.address,
    };
  }

  public async getModels(): Promise<DeskModelItem[]> {
    return REGISTRY;
  }

  public async getModel(modelName: string): Promise<DeskModelItem> {
    const [item = null] = REGISTRY.filter((item) => item.name === modelName);

    if (item === null) {
      throw new Error(
        `Desk model name: ${modelName} is not registered in the REGISTRY`,
      );
    }

    return item;
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

  public async to(
    profile: string,
    position: number,
    unit: LENGTH_UNITS,
  ): Promise<boolean> {
    const desk = await this.connectDevice(profile);
    return desk.moveTo(position, unit);
  }

  public onStateChange(profile: string, handler: (state: DeskState) => void) {
    this.stateChangeEmitter.on(`state.change.${profile}`, handler);
  }

  public async discoverDevices(
    model: DeskModelItem,
  ): Promise<DiscoveredDevice[]> {
    return this.bluetooth.discoverDevices(model.services);
  }

  public async connect(profile: string, modelName: string, address: string) {
    const config = new ConfigManager(profile);

    const bluetoothDevice = await this.bluetooth.connect(address);

    await bluetoothDevice.Pair();

    await bluetoothDevice.Paired();

    await this.connectDevice(profile);

    await config.setConnectedDevice({
      name: profile,
      address,
      modelName,
    });

    return true;
  }

  private async connectDevice(profile: string): Promise<AbstractDesk> {
    if (this.connectedDevices[profile]) {
      return this.connectedDevices[profile];
    }

    const config = new ConfigManager(profile);
    const { address, modelName } = config.getConnectedDevice();
    const model = factory.getDeskModel(modelName);
    await this.bluetooth.startDiscovery();
    const bluetoothDevice = await this.bluetooth.connect(address);
    await this.bluetooth.stopDiscovery();
    const desk = factory.createDesk(model, bluetoothDevice);
    await desk.connect();
    await desk.device.Connected();

    desk.addListener(DESK_EVENT.STATE_CHANGE, (state) => {
      this.stateChangeEmitter.emit(`state.change.${profile}`, state);
    });

    await desk.subscribe();

    this.connectedDevices[profile] = desk;

    return desk;
  }
}
