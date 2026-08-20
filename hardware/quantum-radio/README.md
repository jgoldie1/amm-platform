# TRYAMM Quantum Radio Hardware

## Purpose
Quantum Radio is the physical wireless/edge node for HoloNet and Quantum WiFi. Version 1 is a real, buildable software-defined multi-radio platform. The word `Quantum` is the TRYAMM architecture/brand; quantum communication is not claimed unless a verified quantum hardware module is actually installed and tested.

## v1 hardware blocks
- Compute module: ARM64 Linux SOM for HoloNet services, telemetry, local AI and secure management.
- FPGA/programmable logic: packet timestamping, deterministic queues, sensor/radio preprocessing and low-latency acceleration.
- Wi-Fi radio: tri-band 2.4/5/6 GHz module with WPA3, 802.1X and fast roaming support where certified hardware supports it.
- Bluetooth LE: controllers, remotes, wearables, accessibility devices and nearby-device setup.
- UWB: short-range positioning, secure proximity and room/device localization.
- Optional SDR expansion: receive/transmit experimentation only within certified/licensed limits and the attached regulatory profile.
- Ethernet: at least one multigigabit wired uplink for edge/backhaul.
- Secure element/TPM: device key storage, measured boot, certificate identity and signed firmware verification.
- Optional QRNG module: hardware quantum-random-number source for key material/entropy when independently validated.
- GNSS/PTP timing option: disciplined timestamps for telemetry and multi-node coordination.
- Power: USB-C PD or isolated DC input; optional PoE for fixed access-point/edge-node deployments.
- Hardware watchdog and reset path.
- Thermal and power telemetry.

## Software stack
1. Secure boot -> signed firmware/OS.
2. Holo Identity/PKI device enrollment.
3. Quantum WiFi policy engine.
4. HoloNet service gateway/federation.
5. Quantum Lag Buster telemetry routing.
6. Device QoS: safety/accessibility/realtime/interactive/media/bulk.
7. Local cache/edge services.
8. Audit/evidence output.

## Product roles
- Home/creator Quantum Radio: local TRYAMM edge + Wi-Fi access + controller/casting hub.
- Venue node: LIVE/PK, games, XR and creator events.
- Mobility node: vehicle/robot/drone connectivity gateway; never replaces certified vehicle-control links.
- Community mesh node: federated HoloNet edge service where lawful and authorized.
- Data-center edge appliance: wired service node without local consumer Wi-Fi requirement.

## Safety and regulatory gates
- No arbitrary RF transmission outside certified hardware, permitted bands, power limits and jurisdiction rules.
- Physical radio firmware must enforce region/country regulatory profiles.
- External antennas/amplifiers must remain inside approved EIRP limits.
- SDR capabilities ship disabled unless explicitly enabled for an authorized test profile.
- The LLM/Stubbs AI can manage policy and diagnostics but cannot override RF regulatory limits, secure boot, identity, emergency shutdown or network route authorization.

## Prototype phases
### P0 — Development bench
Certified Wi-Fi/BLE/UWB modules + Linux compute + secure element. Validate HoloNet identity, QoS, telemetry and failover.

### P1 — Integrated prototype
Custom carrier PCB, thermal design, enclosure, multigigabit Ethernet/PoE, watchdog and optional FPGA/QRNG daughtercards.

### P2 — Pre-compliance
RF, EMC, electrical, thermal, security and interoperability testing; lock regional RF tables.

### P3 — Certification candidate
Final PCB/enclosure/firmware, manufacturing test fixtures, signed release images and applicable FCC/ISED/CE or other regional approval work.

## Required evidence before production
- Schematic/PCB source and BOM
- Antenna/RF path documentation
- Power/thermal analysis
- Secure-boot and key-provisioning procedure
- Firmware SBOM
- RF/EMC test reports
- Penetration/security test report
- Manufacturing test plan
- Regulatory approvals for target markets
