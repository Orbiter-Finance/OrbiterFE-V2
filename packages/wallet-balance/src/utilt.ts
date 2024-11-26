import { BaseBalance, VMType } from './interface';
import { BTCVM } from './lib/btc.vm';
import { CairoVM } from "./lib/cairo.vm";
import { EVM } from "./lib/ethereum.vm";
import { FUELVM } from './lib/fuel.vm';
import { IMXVM } from "./lib/imx.vm";
import { LPRVM } from "./lib/lpr.vm";
import { SolanaVM } from "./lib/solana.vm";
import { SUIVM } from './lib/sui.vm';
import { TonVM } from "./lib/ton.vm";
import { TronVM } from "./lib/tron.vm";
import { ZKLITEVM } from "./lib/zklite.vm";

export function createBalanceServiceByVM(vm: VMType): BaseBalance | undefined {
    let service: BaseBalance | undefined;
    switch (vm) {
        case VMType.BTCVM:
            service = new BTCVM();
            break;
        case VMType.CAIROVM:
            service = new CairoVM();
            break;
        case VMType.EVM:
            service = new EVM();
            break;
        case VMType.IMXVM:
            service = new IMXVM();
            break;
        case VMType.LPRVM:
            service = new LPRVM();
            break;
        case VMType.SOLANAVM:
            service = new SolanaVM();
            break;
        case VMType.TVM:
            service = new TonVM();
            break;
        case VMType.TRONVM:
            service = new TronVM();
            break;
        case VMType.ZKLITEVM:
            service = new ZKLITEVM();
            break;
        case VMType.FUELVM:
          service = new FUELVM();
          break;
        case VMType.SUIVM:
          service = new SUIVM();
          break;
        default:
            service = undefined;
    }
    return service;
};