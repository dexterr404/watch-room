import dotenv from 'dotenv'
import Mux from '@mux/mux-node'

dotenv.config();

const mux = new Mux({
    tokenId: process.env.MUX_TOKEN!,
    tokenSecret: process.env.MUX_SECRET!,
});

export default mux;