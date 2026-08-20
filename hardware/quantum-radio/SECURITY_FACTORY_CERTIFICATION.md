# Quantum Radio — Security, Manufacturing and Certification Package

## Secure boot / key provisioning
1. Manufacturing HSM or approved offline root signs device identity certificates and release firmware.
2. Device-unique key is generated inside TPM/secure element where supported and is never exported in plaintext.
3. Optional QRNG entropy is mixed into approved cryptographic DRBG/key-generation paths only after health tests pass.
4. Boot ROM/firmware verifies signed bootloader, kernel/OS image and critical FPGA/radio firmware.
5. Holo Identity enrollment binds serial number, hardware revision, certificate and owner/operator record.
6. Certificate rotation, revocation, recovery and factory-reset procedures are mandatory.
7. Debug interfaces are disabled/locked in production or require authenticated service mode.

## Firmware SBOM requirements
Track package/component name, version, supplier, license, source, hash, CVE/advisory status, update owner and end-of-support date for:
- bootloader
- Linux kernel/OS
- Wi-Fi/BLE/UWB firmware
- 5G modem firmware
- FPGA image/toolchain runtime
- HoloNet agent
- Quantum WiFi policy engine
- telemetry/observability agent
- cryptographic libraries
- QRNG driver/health-test software

Generate SPDX or CycloneDX SBOM for each signed release candidate.

## Authorized penetration/security test scope
Only on owned/authorized prototype and test networks:
- secure boot downgrade/tamper resistance
- certificate impersonation/revocation
- management API authentication/authorization
- RLS/service isolation for HoloNet data
- Wi-Fi/WPA3 configuration and guest isolation
- local-network segmentation
- firmware update verification/rollback policy
- supply-chain/SBOM vulnerability scan
- exposed service/port review
- denial-of-service resilience under safe lab limits
- physical debug/tamper paths
- secrets-at-rest and logs
- privacy/accessibility traffic isolation

## Factory manufacturing tests
- board visual/AOI inspection
- power-rail shorts/current limits
- secure-element/TPM presence and provisioning
- serial/MAC/device-ID uniqueness
- DDR/storage test
- Ethernet link/throughput
- Wi-Fi/BLE/UWB radio functional test using approved fixture
- cellular modem detection and certified test mode where applicable
- GNSS/PPS test for timing SKU
- temperature/current sensors
- fan/watchdog/reset/tamper
- QRNG self-test/health status when installed
- signed firmware boot and attestation
- enclosure/label/region SKU verification

## EVT → DVT → PVT gates
### EVT
Electrical bring-up, interfaces, RF module function, power/thermal characterization, secure boot and HoloNet identity.
### DVT
Final-ish PCB/enclosure, RF/EMC pre-compliance, environmental tests, interoperability, security testing, manufacturing fixture validation.
### PVT
Production BOM, factory programming/provisioning, yield tracking, final compliance reports, signed golden image and field-pilot batch.

## Certification matrix — determine per target SKU/market
- United States: FCC equipment authorization; carrier/module approvals as applicable.
- Canada: ISED requirements as applicable.
- EU/EEA: CE/Radio Equipment Directive and applicable safety/EMC/environmental obligations.
- UK: UK radio/electrical requirements as applicable.
- Wi-Fi/Bluetooth/UWB: alliance/vendor certification as product strategy requires.
- Cellular: PTCRB/GCF/carrier certification where applicable to chosen modem/product role.
- Electrical/product safety: applicable IEC/UL/CSA standards based on PSU, enclosure and use case.
- Environmental/material: RoHS/REACH/WEEE and regional equivalents where required.
- Outdoor/tower: enclosure ingress, grounding/lightning, structural/site/electrical rules.

This matrix is planning guidance, not a certification claim. Final applicability must be determined by qualified compliance labs/counsel for each SKU and region.