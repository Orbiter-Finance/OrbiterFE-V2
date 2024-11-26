export const GLOBAL_BASE_KEY = 'ORBITER_'

export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || ''

export const GOOGLE_EVENT_KEY = GLOBAL_BASE_KEY + 'GOOGLE_EVENT_KEY'

export const GOOGLE_ANALYTICS_ID = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID

export const MQTT_USER_NAME = process.env.NEXT_PUBLIC_MQTT_USER_NAME
export const MQTT_PASSWORD = process.env.NEXT_PUBLIC_MQTT_PASSWORD
export const MQTT_HREF = process.env.NEXT_PUBLIC_MQTT_HREF
export const PRIZES_URL = process.env.NEXT_PUBLIC_PRIZES_URL

export const HOST_ENV_MAINNET = process.env.NEXT_PUBLIC_NODE_ENV !== 'test'

export const MQTT_CONFIG = {
    href: MQTT_HREF || '',
    clean: true,
    connectTimeout: 30 * 1000, // ms
    reconnectPeriod: 4000, // ms
    clientId: 'mqttx_' + Math.random().toString(16).substring(2, 8),
    username: MQTT_USER_NAME || '',
    password: MQTT_PASSWORD || '',
}

export const CND_URL = 'https://cdn.orbiter.finance'

export enum Media_LINK {
    Github = 'https://github.com/Orbiter-Finance',
    Twitter = 'https://twitter.com/Orbiter_Finance',
    Telegram = 'https://t.me/orbiterORB',
    Medium = 'https://orbiter-finance.medium.com/',
    Discord = 'https://discord.gg/FbztTBvnBT',
    Docs = 'https://docs.orbiter.finance/',
    Brand = 'https://docs.orbiter.finance/support-and-misc./brand-kit',
    TermOfUse = 'https://get.orbiter.finance/Orbiter_Finance_Terms_of_Use.pdf',
}

export const MENU_LIST = [
    {
        label: 'Bridge',
        path: '/',
        key: 'bridge',
        icon: '/assets/icon/header/bridge.svg',
    },
    {
        label: 'Explore',
        path: '/explore',
        key: 'explore',
        icon: '/assets/icon/header/explore.svg',
    },
    {
        label: 'Prizes',
        path: '/prizes',
        key: 'prizes',
        icon: '/assets/icon/header/prizes.svg',
    },
    // {
    //     label: 'Collector',
    //     path: '/collector',
    //     key: 'collector',
    //     icon: '/assets/icon/header/collector.svg',
    // },
]
