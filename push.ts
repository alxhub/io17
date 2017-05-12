const push = require('web-push');

const subscription = JSON.parse(process.argv[2]);
const payload = {
  notification: {
    title: 'NgStore',
    icon: '/assets/logo-96.png',
    body: 'Angular PWAs at Google IO!',
    requireInteraction: false,
  },
};

const credentials = {
  vapidDetails: {
    subject: 'mailto:test@angular.io',
    publicKey: 'BPm3UsR79ZIPppvRYEkWpDzbPB8tTSKKsG16qmvCPv6tyBdUMUu8lOZoRxtLnVSkTbzQlp0b6oJ_1TYXt3sMFdo',
    privateKey: '8KHDAvQF77xinlev5DhLXhz0yzWVRbNcrJuvPhDzcV8',
  },
};

push.sendNotification(subscription, payload, credentials).catch(err => console.error(err));
