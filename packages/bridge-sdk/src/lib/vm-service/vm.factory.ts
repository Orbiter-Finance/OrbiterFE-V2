import { VMType } from "@orbiter-finance/vm-core";
import { ConfigService } from "../config.service";
import { EVMService } from "./implement/evm.service";
import { CAIROVMService } from "./implement/cario.service";
import { IMXVMService } from "./implement/imx.service";
import { LPRVMService } from "./implement/lpr.service";
import { SolanaVMService } from "./implement/solana.service";
import { TVMService } from "./implement/t.service";
import { ZKLITEVMService } from "./implement/zklite.service";
import { TRONVMService } from "./implement/tron.service";
import { BTCVMService } from "./implement/btc.service";
import { FUELVMService } from "./implement/fuel.service";
import { APTOSVMService } from "./implement/aptos.service";
import { SUIVMService } from "./implement/sui.service";
import { VMService } from "./vm.service";

export class VMServiceFactory {
  private _services: { [key: string]: VMService } = {};
  private configService: ConfigService;

  constructor(configService: ConfigService) {
    this.configService = configService;
  }

  getVMService(vmType: VMType): VMService | undefined {
    if (!this._services[vmType]) {
      return this.createVMService(vmType);
    } else {
      return this._services[vmType];
    }
  }

  createVMService(vmType: VMType): VMService | undefined {
    let service: VMService | undefined;
    switch (vmType) {
      case VMType.EVM:
        service = new EVMService(this.configService);
        break;
      case VMType.IMXVM:
        service = new IMXVMService(this.configService);
        break;
      case VMType.LPRVM:
        service = new LPRVMService(this.configService);
        break;
      case VMType.SOLANAVM:
        service = new SolanaVMService(this.configService);
        break;
      case VMType.CAIROVM:
        service = new CAIROVMService(this.configService);
        break;
      case VMType.TVM:
        service = new TVMService(this.configService);
        break;
      case VMType.ZKLITEVM:
        service = new ZKLITEVMService(this.configService);
        break;
      case VMType.TRONVM:
        service = new TRONVMService(this.configService);
        break;
      case VMType.BTCVM:
        service = new BTCVMService(this.configService);
        break;  
      case VMType.FUELVM:
        service = new FUELVMService(this.configService);
        break;
      case VMType.APTOSVM: 
        service = new APTOSVMService(this.configService);
        break;
      case VMType.SUIVM: 
        service = new SUIVMService(this.configService);
        break;
      default:
        service = undefined;
        break;
    }
    if (service) {
      this._services[vmType] = service;
    }
    return service;
  }

}