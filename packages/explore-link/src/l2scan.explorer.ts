import { ExploreType } from './config.interface';
import { EtherscanExplorer } from "./etherscan.explorer";

export class L2ScanExplorer extends EtherscanExplorer {
    name = ExploreType.L2Scan;
    constructor(url: string) {
        super(url)
    }
}