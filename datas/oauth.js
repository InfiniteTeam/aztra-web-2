/*
const redirect_uri = process.env.NODE_ENV === 'production'
    ? 'http://aztra.inft.kr/auth'
    : 'http://localhost:3000/auth'
*/

const redirect_uri = process.browser ? `${window.location.origin}/auth` : ''

const oauth = {
    discord_oauth2: `https://discord.com/api/oauth2/authorize?client_id=751339721782722570&redirect_uri=${encodeURIComponent(redirect_uri)}&response_type=code&scope=identify%20email%20guilds`,
    api_endpoint: "https://discord.com/api/v8"
};

export default oauth;