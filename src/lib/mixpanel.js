import mixpanel from "mixpanel-browser";

const MIXPANEL_TOKEN = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN;

mixpanel.init(MIXPANEL_TOKEN);

export default mixpanel;
