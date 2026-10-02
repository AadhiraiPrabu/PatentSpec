export interface SamplePaper {
  id: string;
  title: string;
  domain: string;
  collegeDept: string;
  authors: string;
  description: string;
  content: string;
}

export const SAMPLE_PAPERS: SamplePaper[] = [
  {
    id: 'iot-smart-agriculture',
    title: 'An Autonomous IoT Edge Sensor Network for Subsurface Soil Moisture and Nutrient Monitoring',
    domain: 'Agriculture & IoT',
    collegeDept: 'Dept. of Electronics & Communication Engineering',
    authors: 'Dr. R. K. Sharma, Prof. Meera Nair, Arun V.',
    description: 'A typical professor manuscript containing academic literature reviews, citation references [1-4], experimental setups, and methodology descriptions.',
    content: `Title: An Autonomous IoT Edge Sensor Network for Subsurface Soil Moisture and Nutrient Monitoring
Authors: Dr. R. K. Sharma, Prof. Meera Nair, Arun V.
Department of Electronics and Communication Engineering, National Institute of Technology

Abstract:
In this research paper, we propose a novel low-power Internet of Things (IoT) subsurface probe assembly for precision agricultural irrigation. Traditional soil probes suffer from rapid bio-fouling, high battery consumption, and inaccurate nitrate estimation in variable salinity soils. In our work, we present a multi-depth probe integrating capacitive impedance sensing and spectral optical analysis coupled with an ultra-low-power ESP32 edge microcontroller. Our experimental results on a 5-hectare test farm indicate a 34% reduction in irrigation water usage and 98.2% telemetry transmission reliability over LoRaWAN.

1. Introduction
Agricultural irrigation accounts for more than 70% of global freshwater withdrawal. Over the last decade, numerous researchers have investigated automated irrigation systems [1, 2]. However, most commercial soil sensors rely on time-domain reflectometry (TDR), which is prohibitively expensive for smallholder farmers in developing countries [3]. Furthermore, as demonstrated by Chen et al. [4], salinity variations introduce significant measurement drifts.

In this paper, our primary contributions are:
1. Designing a tiered cylindrical sensor probe with hydrophobic porous polymer shielding to mitigate bio-fouling.
2. Formulating an adaptive dual-frequency excitation algorithm that decouples ionic conductivity (salinity) from volumetric water content (VWC).
3. Implementing a dynamic solar energy harvesting circuit with supercapacitor buffering for maintenance-free 5-year deployment.

2. System Architecture & Proposed Methodology
The proposed system consists of three major physical units:
Figure 1 shows the schematic block diagram of our autonomous subsurface soil probe.
Figure 2 shows the internal cross-sectional architecture of the multi-depth sensor casing.
Figure 3 is a circuit schematic of the adaptive frequency exciter and synchronous demodulator.
Figure 4 depicts the state transition flowchart for the edge microcontroller power-saving modes.

Unit 1: Probe Body
The probe body comprises a 45cm UV-stabilized polycarbonate tube containing three distinct sensing rings situated at 10cm, 25cm, and 40cm depths. Each ring contains two semi-circular copper electrode plates embedded under a 0.2mm PTFE dielectric layer.

Unit 2: Adaptive Dual-Frequency Signal Generator
A microcontrolled DDS (Direct Digital Synthesizer) generates a 100 kHz reference signal and a 50 MHz high-frequency pulse. By computing the phase displacement and attenuation across the capacitive soil matrix between electrodes, the system isolates dielectric permittivity from ionic loss tangents.

Unit 3: Edge Processing & Telemetry
The core processor is an ultra-low power 32-bit RISC-V SoC with integrated SX1262 LoRa transceiver. Sensor measurements are sampled every 15 minutes, compressed using delta-encoding, and transmitted to a gateway within a 12 km line-of-sight range.

3. Experimental Results & Discussion
We conducted extensive field validation across three crop seasons (Kharif and Rabi). Table 1 compares our sensor with Decagon 5TE commercial probes. The mean absolute error (MAE) in volumetric water content was 1.4%, outperforming standard capacitive sensors by 4.2x in saline soils (EC > 4 dS/m).

4. Conclusion & Future Work
We have successfully developed an autonomous, low-cost subsurface probe for precision farming. In future work, we intend to integrate miniature electrochemical nitrogen-phosphorus-potassium (NPK) ion-selective electrodes into the probe tip.

References:
[1] Patel et al., "Smart Irrigation Systems using ZigBee," IEEE Trans. Agri., 2021.
[2] Kumar & Singh, "Soil Moisture Sensing Techniques: A Survey," Sensors Journal, 2022.
[3] Jackson et al., "Economic Feasibility of IoT in Smallholder Farms," AgTech Review, 2023.
[4] Chen et al., "Salinity Compensation in Capacitive Moisture Sensors," Soil Sci. Soc. Am. J., 2020.`
  },
  {
    id: 'ai-medical-retinopathy',
    title: 'A Lightweight Edge-Deployable Convolutional Transformer for Real-Time Diabetic Retinopathy Screening',
    domain: 'Biomedical & AI',
    collegeDept: 'Dept. of Computer Science & Biomedical Engineering',
    authors: 'Prof. Ananya Sen, Dr. K. Murthy',
    description: 'An AI/deep learning research draft with neural network architectures, training datasets, and performance benchmarks that need conversion into patent claims and specification.',
    content: `Title: A Lightweight Edge-Deployable Convolutional Transformer for Real-Time Diabetic Retinopathy Screening
Authors: Prof. Ananya Sen, Dr. K. Murthy
School of Computing, State University

Abstract:
Diabetic Retinopathy (DR) is a primary cause of preventable blindness worldwide. While deep neural networks have demonstrated high diagnostic accuracy on desktop GPUs, existing models like ResNet-50 and Vision Transformers require over 15 GFLOPs of computation, rendering them unusable on low-cost handheld ophthalmic fundus cameras. In this paper, we present 'RetinaLite', a hybrid convolutional-attention network utilizing depthwise separable convolutions with inverted residual bottlenecks and spatial windowed self-attention. Our model achieves 96.4% sensitivity and 94.1% specificity with only 2.1 million parameters and 42ms inference time on an embedded ARM Cortex-A72 processor.

1. Problem Statement & Background
Fundus photography in rural clinics often lacks on-site ophthalmologists. Current telemedicine pipelines transmit uncompressed fundus images (15-25 MB) over cellular networks to central cloud servers [1]. This causes intolerable latency and violates patient privacy in bandwidth-constrained primary health centers [2]. Prior arts such as US Patent 10,245,678 focus purely on cloud-based ensemble learning.

2. The Proposed Invention
To overcome these limitations, we designed a self-contained embedded fundus screening device.
Figure 1 shows the handheld hardware assembly including optical lens adapter, polarized illumination ring, and CMOS image sensor.
Figure 2 shows the neural network architecture including the multi-scale feature extractor and tokenized cross-attention layer.
Figure 3 is a diagnostic decision tree showing triage categorization into No DR, Mild Non-Proliferative, Moderate, Severe, and Proliferative DR.

The device operates as follows:
First, a ring of 8 dual-wavelength LEDs (525nm green and 630nm red) delivers glare-free non-mydriatic illumination through cross-polarizing filters.
Second, a 12-megapixel CMOS sensor captures the retinal image and feeds it to an onboard FPGA-accelerated neural processing unit.
Third, the network processes green-channel reflectance maps to segment microaneurysms, hemorrhages, and hard exudates.
Fourth, a local confidence engine computes an uncertainty score. If the score exceeds 0.85, the patient is flagged for urgent referral without requiring external internet connectivity.

3. Performance Evaluation
Tested against the Messidor-2 and EyePACS public benchmark datasets, RetinaLite demonstrated an Area Under Receiver Operating Characteristic (AUROC) curve of 0.981 while consuming under 3.2 Watts of power.

References:
[1] World Health Organization, "Global Report on Diabetes," 2023.
[2] Raman et al., "Tele-ophthalmology in Rural India," Indian J. Ophthalmol., 2022.`
  },
  {
    id: 'green-materials-polymer',
    title: 'Biodegradable Thermoplastic Polyurethane Composite Derived from Cashew Nut Shell Liquid and Lignocellulosic Fiber',
    domain: 'Chemical & Materials Science',
    collegeDept: 'Dept. of Polymer Chemistry & Materials Science',
    authors: 'Dr. V. Rajesh, Dr. Priya Nambiar',
    description: 'A chemical/materials science lab paper with synthesis protocols, reaction formulations, and tensile testing results ready for patent claim composition.',
    content: `Title: Biodegradable Thermoplastic Polyurethane Composite Derived from Cashew Nut Shell Liquid and Lignocellulosic Fiber
Authors: Dr. V. Rajesh, Dr. Priya Nambiar
Department of Materials Science and Chemical Engineering

Abstract:
Conventional petrochemical-derived polyurethane elastomers contribute substantially to persistent microplastic pollution due to their non-biodegradable urethane crosslinks. In this paper, we synthesize a bio-based polyol from cardanol, a renewable agricultural byproduct extracted from Cashew Nut Shell Liquid (CNSL). The synthesized bio-polyol was reacted with 4,4'-methylene diphenyl diisocyanate and reinforced with silane-functionalized coir microfibers (10-30 wt%). The resulting composite exhibited a tensile strength of 38.5 MPa, elongation at break of 420%, and achieved 82% soil burial biodegradation within 180 days according to ASTM D5988 standards.

1. Background of the Study
Cashew nut processing generates vast quantities of toxic, acidic liquid known as Cashew Nut Shell Liquid (CNSL). Typically treated as hazardous waste [1], CNSL contains anacardic acid, cardanol, and cardol. Concurrently, synthetic foams used in packaging and footwear generate over 12 million metric tons of landfill waste annually [2]. There is a critical need for an environmentally benign, industrially scalable process to convert agricultural waste into high-performance structural elastomers.

2. Experimental Formulation & Method
Figure 1 is a chemical reaction pathway diagram depicting the epoxidation of cardanol followed by catalytic ring-opening to yield the trifunctional bio-polyol.
Figure 2 is a schematic of the twin-screw extrusion compounding process for dispersing silane-treated coir microfibers into the polymer matrix.
Figure 3 is a thermogravimetric analysis (TGA) graph illustrating thermal stability up to 285 degrees Celsius.

Formulation:
- Cardanol-derived bio-polyol having a hydroxyl value between 180-220 mg KOH/g: 45 to 60 parts by weight
- Bio-based 1,4-butanediol chain extender: 5 to 10 parts by weight
- Diisocyanate (MDI or H12MDI): 30 to 40 parts by weight
- Surface-modified coir fibers (aspect ratio 25:1, treated with 3-aminopropyltriethoxysilane): 15 parts by weight
- Dibutyltin dilaurate catalyst: 0.05 parts by weight

The mixture is processed in a co-rotating twin screw extruder at 170-190°C and injection molded into standardized test specimens.

3. Testing & Results
The green composite demonstrated water absorption of less than 2.8% over 24 hours immersion, with zero phase segregation. Soil degradation tests in compost medium confirmed rapid microbial colonization and chain scission.`
  }
];
