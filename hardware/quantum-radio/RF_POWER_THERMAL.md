# Quantum Radio — RF, Power and Thermal Engineering Plan

## RF / antenna documentation
- Maintain separate RF chains for Wi-Fi 2.4/5/6 GHz, BLE, UWB, GNSS and cellular modules.
- Prefer pre-certified radio modules and vendor reference layouts for EVT/P1.
- Record antenna vendor, model, gain, connector, cable loss, placement, polarization and allowed region/SKU combinations.
- Validate isolation/coexistence between Wi-Fi, BLE, UWB, GNSS and cellular radios.
- Measure conducted and radiated power, EVM, sensitivity, coexistence, spurious emissions and antenna efficiency during pre-compliance.
- Enforce per-region RF tables in signed firmware. No software/AI override.

## 5G-ready profile
The hardware supports a certified 5G modem slot and backhaul/service integration. Public cellular service requires carrier/core integration, lawful spectrum/network rights, SIM/eSIM provisioning, emergency-service obligations where applicable and regional certification.

## 9G-Future profile
`9G-Future` is a reserved research/expansion interface. It must not be marketed as a standardized or deployed 9G network until an actual standard, certified radio technology and lawful deployment path exist.

## Power tree
Prototype input options:
- 12–24 V isolated DC input
- USB-C PD for lab/home SKU
- PoE++ candidate for fixed edge/venue SKU

Power rails:
- 12 V / raw input protection
- 5 V system rail
- 3.3 V peripherals/RF logic
- 1.8 V I/O/timing
- dedicated SOM/FPGA core rails per selected vendor
- isolated/noise-controlled rails for sensitive RF/timing where needed

Telemetry:
- input voltage/current/power
- per-rail power where practical
- CPU/FPGA/radio/modem temperatures
- fan RPM
- brownout and power-cycle reason

## Preliminary thermal envelope
Targets are provisional until selected modules are characterized.
- Home/creator unit: passive-first; fan only above configured thermal threshold.
- Venue/tower unit: active cooling permitted; replaceable fan and heatsink assembly.
- Mobility unit: derate by ambient temperature and enclosure constraints.
- Tower outdoor enclosure: environmental sealing, sun-load allowance, heater/fan strategy where required.

Thermal validation must include idle, sustained LIVE/PK, sustained game/XR traffic, peak Holo Edge cache load, 5G modem peak transfer, simultaneous radios, maximum ambient and blocked-airflow fault cases.

## Performance telemetry for Benchmark & Proof
- Wi-Fi latency P50/P95/P99
- jitter
- packet loss
- roaming time
- LIVE dropped frames
- PK synchronization drift
- VR motion-to-network latency
- casting startup time
- concurrent-device capacity
- throughput per radio/client class
- watts/device and watts/Gbps
- thermal throttle events/time
- security events
- QRNG health/entropy-source status when installed
