import * as fs from 'fs';

declare interface WebPushParams {
  TTL?: number;
  userPublicKey?: Buffer;
  userAuth?: Buffer;
  payload?: any;
  vapid?: any;
}

declare interface WebPush {
  sendNotification(endpoint: string, params: WebPushParams): Promise<any>;
  setGCMAPIKey(key: string);
}

let push: WebPush = require('web-push');

export function sendPush(reg: any, payload?: Object): Promise<any> {
  let endpoint = reg.url;
  return push.sendNotification(endpoint, {
    userPublicKey: reg.key,
    userAuth: reg.auth,
    payload: new Buffer(JSON.stringify(payload))
  }).catch(err => console.error(err));
}

const key = JSON.parse(fs.readFileSync('./.ngsw-config.json').toString())['gcm_key'];
push.setGCMAPIKey(key);

const reg = JSON.parse(process.argv[2]);
const msg = process.argv[3];

sendPush(reg, {
  notification: {
    title: 'Demo Push',
    body: msg,
    icon: '/assets/logo.png',
    requireInteration: false,
  },
})