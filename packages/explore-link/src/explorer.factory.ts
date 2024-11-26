import { BlockscoutExplorer } from "./blockscout.explorer";
import { Explorer, ExplorerItem, ExploreType } from "./config.interface";
import { EtherscanExplorer } from "./etherscan.explorer";
import { L2ScanExplorer } from "./l2scan.explorer";
import { OKXExplorer } from "./okx.explorer";
import { StarkscanExplorer } from "./starkscan.explorer";
import { TronScanExplorer } from "./tronscan.explorer";
import { UnknownExplorer } from "./unknown.explorer";

export class ExplorerFactory {
  static createExplorer(config: ExplorerItem): Explorer {
    switch (config.name) {
      case ExploreType.Etherscan:
        return new EtherscanExplorer(config.url);
      case ExploreType.Blockscout:
        return new BlockscoutExplorer(config.url);
      case ExploreType.Starkscan:
        return new StarkscanExplorer(config.url);
      case ExploreType.OKX:
        return new OKXExplorer(config.url);
      case ExploreType.TronScan:
        return new TronScanExplorer(config.url);
      case ExploreType.L2Scan:
        return new L2ScanExplorer(config.url);
      default:
        return new UnknownExplorer(config.url);
    }
  }
}