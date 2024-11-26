import { ExploreType } from './config.interface';
import { EtherscanExplorer } from "./etherscan.explorer";

export class UnknownExplorer extends EtherscanExplorer {
    name = ExploreType.Unknown;
    constructor(url: string) {
        super(url)
    }
}