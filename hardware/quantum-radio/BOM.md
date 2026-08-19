# Quantum Radio — Prototype BOM Framework

Status: engineering BOM framework. Exact manufacturer part numbers remain pending vendor selection and RF/certification review.

| Block | Prototype requirement | Preferred sourcing rule |
|---|---|---|
| Compute | ARM64 Linux SOM, 8–16 GB RAM, eMMC/NVMe support | Industrial-temp option preferred |
| FPGA | Midrange FPGA/programmable logic with PCIe/Ethernet-capable I/O | Long-lifecycle vendor |
| Wi-Fi | Certified tri-band 2.4/5/6 GHz Wi-Fi module | Use module with regional certifications |
| Bluetooth | BLE 5.x controller/module | Certified module where possible |
| UWB | Secure-ranging UWB module | Certified/module vendor reference layout |
| Cellular | Certified 5G modem module + M.2/B2B carrier | Carrier-certified variant where available |
| Future radio bay | M.2/PCIe/USB/SDR-compatible research slot | Disabled by default |
| Secure element | Hardware root of trust | Device certificate/key support |
| TPM | TPM 2.0 | Measured boot / attestation |
| QRNG | Independently validated QRNG module | Optional daughtercard |
| Ethernet | 2.5/5/10 GbE PHY + magnetics | Industrial rated |
| PoE | IEEE-compliant PoE PD controller | Fixed/venue/tower SKUs |
| USB-C PD | USB-C PD sink/controller | Protected power entry |
| PMIC/DC-DC | High-efficiency buck converters | Telemetry-capable where practical |
| GNSS/PTP | GNSS receiver + PPS/timing support | Optional precision-timing SKU |
| Storage | NVMe SSD or eMMC | Signed/encrypted system storage |
| Sensors | Temperature/current/voltage/tamper | Board health + manufacturing test |
| Cooling | Heat spreader + fan option | SKU-dependent |
| Antennas | Vendor-approved Wi-Fi/BLE/UWB/GNSS/cellular antennas | Match certified RF path |
| Connectors | Locked RF/coax, Ethernet, USB, debug/service headers | Production serviceability |

## Vendor approval criteria
- Lifecycle/availability
- Regional certifications
- Published security advisories
- Firmware update path
- Supply-chain traceability
- Export/regulatory constraints
- Thermal/power fit
- Interoperability test evidence

No component is considered production-approved until procurement, RF, security and manufacturing reviews are complete.