import pubnubKeys from "../config/pubnub-keys.json";
import Pubnub from "pubnub";

const pubnubConfig = {
  ...pubnubKeys,
  ssl: true,
  cipherKey: '1hvqOvPLzdww8n3E',
}

export default new Pubnub(pubnubConfig);
