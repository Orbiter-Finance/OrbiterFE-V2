import { ExploreType } from './config.interface';
import { EtherscanExplorer } from "./etherscan.explorer";

export class BlockscoutExplorer extends EtherscanExplorer {
    name = ExploreType.Blockscout;
    constructor(url: string) {
        super(url)
    }
}