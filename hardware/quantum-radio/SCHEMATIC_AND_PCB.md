# Quantum Radio — Schematic + PCB Engineering Plan

Status: prototype engineering specification; not a production release.

## Board architecture
- ARM64 compute SOM on high-speed mezzanine/carrier connector.
- FPGA/programmable logic block for timestamping, deterministic queues, radio preprocessing and telemetry acceleration.
- Certified tri-band Wi-Fi 2.4/5/6 GHz module with PCIe/SDIO/USB interface depending on selected module.
- Bluetooth LE + optional UWB module.
- Optional cellular modem bay for certified 5G modem modules. The design is 5G-ready; it does not transmit cellular service without an approved modem, SIM/eSIM profile, carrier/core integration and lawful spectrum/network authorization.
- Optional future-radio research bay branded `9G-Future`. This is a research interface only; no standardized 9G radio is claimed.
- Secure element/TPM over SPI/I2C for device identity and secure key storage.
- Optional validated QRNG daughtercard over SPI/USB/PCIe for entropy input.
- 2.5/5/10 GbE PHY depending on BOM/cost target; PoE PD option for fixed edge nodes.
- USB-C PD / isolated DC input power front end.
- GNSS/PTP timing header and PPS input/output.
- Hardware watchdog, board reset supervisor, tamper input, secure-boot straps and recovery jumper.

## Critical nets
- `PWR_12V_IN`, `PWR_POE_IN`, `PWR_USB_PD_IN`
- `SYS_5V`, `SYS_3V3`, `SYS_1V8`, `FPGA_CORE`, `SOM_CORE`
- `PCIE_RADIO0`, `PCIE_CELLULAR0`, `PCIE_FPGA`
- `USB_QRNG`, `USB_BLE`, `USB_UWB`
- `ETH_MDI`, `ETH_REFCLK`
- `TPM_SPI`, `SE_I2C`
- `GNSS_PPS`, `PTP_CLK`
- `THERM_CPU`, `THERM_RF`, `THERM_PSU`
- `FAN_PWM`, `FAN_TACH`
- `HW_WATCHDOG`, `TAMPER`, `RECOVERY_N`

## PCB constraints
- Minimum 8-layer prototype target; 10–12 layers preferred if 10 GbE/high-speed PCIe routing is used.
- Controlled-impedance differential pairs for PCIe, USB 3.x and Ethernet.
- RF feedlines designed to module vendor impedance requirements, normally 50 ohm single-ended.
- Separate noisy DC/DC zones from RF front ends and timing circuits.
- Solid reference planes under high-speed and RF routes; avoid plane splits beneath differential pairs.
- Keep secure-element/TPM traces short and inaccessible from external connectors.
- Dedicated thermal copper/heat-spreader zones under SOM, FPGA, modem and radio modules.
- Antenna connectors and external-amplifier paths must match certified module/antenna combinations and regulatory EIRP limits.

## Release gate
No Gerber, fabrication package or production schematic may be released until selected vendor modules, stack-up, RF path, antenna solution, EMC strategy, thermal solution and regional certification plan have been reviewed by qualified RF/PCB engineers.