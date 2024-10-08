import type { MqttSubscription } from '../../models/MqttSubscription';
import type { PublishOptions } from '../../models/PublishOptions';
import type { MqttOptions } from 'react-native-mqtt';
import type { NativeMqtt } from '../../models/NativeMqtt';

type PublishedMsg = {
  topic: string;
  payloadBase64: string;
  publishOptions: PublishOptions;
};

class MqttNativeMock implements NativeMqtt {
  options: MqttOptions | undefined;
  connectionState = false;
  subscriptions: MqttSubscription[] = [];
  publishedMessages: PublishedMsg[] = [];

  resetMock() {
    this.publishedMessages = [];
    this.subscriptions = [];
    this.options = undefined;
    this.connectionState = false;
  }
  async addListener(_?: string) {}
  async removeListeners(_?: number) {}

  async createClient(options: MqttOptions): Promise<string> {
    this.options = options;
    return 'test-client';
  }

  async connect(_: string) {
    this.connectionState = true;
  }
  async disconnect(_: string) {
    this.connectionState = false;
  }
  async reconnect(_: string) {
    this.connectionState = true;
  }
  async isConnected(_: string) {
    return this.connectionState;
  }
  async subscribe(topics: MqttSubscription[], _: string) {
    this.subscriptions.push(...topics);
  }
  async unsubscribe(topics: string[], _: string) {
    this.subscriptions = this.subscriptions.filter(
      (s) => !topics.includes(s.topic)
    );
  }
  async publish(
    topic: string,
    payload: string,
    options: PublishOptions,
    _: string
  ) {
    this.publishedMessages.push({
      topic,
      payloadBase64: payload,
      publishOptions: options,
    });
  }
  async end(_1: string, _2: boolean) {
    this.connectionState = false;
  }
}

export const mockMqttNative = new MqttNativeMock();
