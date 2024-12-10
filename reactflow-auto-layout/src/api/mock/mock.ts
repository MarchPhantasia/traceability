import Mock from "mockjs";

// type 最后全部指定为base吧
Mock.mock("/api/traceModel", "post", {
  code: 200,
  message: "success",
  requirements: [
    {
      id: "1",
      name: "Support for Multi-Task Payload Operations",
      content: "The Payload Subsystem shall be capable of running multiple payload tasks simultaneously, including but not limited to image acquisition, communication signal processing, and scientific experiments, while ensuring the independence and data integrity of each task."
    },
    {
      id: "2",
      name: "Real-Time Bidirectional Communication",
      content: "The Communications Subsystem shall support real-time bidirectional communication with ground stations, with a data latency of no more than 500ms, and shall perform automatic retransmission in the event of signal interference."
    },
    {
      id: "3",
      name: "Automatic Fault Detection and Switching",
      content: "The Avionics Subsystem shall detect critical faults in key systems and switch to backup systems automatically within 2 seconds."
    },
    {
      id: "4",
      name: "High-Precision Attitude Control",
      content: "The GN&C Subsystem shall achieve high-precision attitude control with an attitude control error not exceeding 0.1 degrees and a response time of no more than 5 seconds."
    },
    {
      id: "5",
      name: "Controllable Thrust Adjustment Range",
      content: "The Propulsion Subsystem shall support a continuous controllable thrust adjustment range of 0-500N to accommodate various orbital corrections and attitude adjustments."
    },
  ],
  traces: [
    [
      "Support for Multi-Task Payload Operations",
      "Payload Subsystem"
    ],
    [
      "Real-Time Bidirectional Communication",
      "Communications Subsystem"
    ],
    [
      "Automatic Fault Detection and Switching",
      "Avionics Subsystem"
    ],
    [
      "High-Precision Attitude Control",
      "GN&C Subsystem"
    ],
    [
      "Controllable Thrust Adjustment Range",
      "Propulsion Subsystem"
    ],
    [
      "High-Precision Attitude Control",
      "Propulsion Subsystem"
    ],
  ]
});
// traces 的前面一个部分是要求的name，后面是对应的模型的name




// console.log("Mocking API...");
Mock.mock("/api/nodes", "post", {
  code: 200,
  message: "success",
  nodes: [
    {
      id: "A",
      type: "base",
    },
    {
      id: "B",
      type: "base",
    },
    {
      id: "C",
      type: "base",
    },
    {
      id: "D",
      type: "sys",
    },
    {
      id: "E",
      type: "base",
    },
    {
      id: "F",
      type: "base",
    },
    {
      id: "4",
      type: "base",
    },
  ],
});

Mock.mock("/api/edges", "post", {
  code: 200,
  message: "success",
  edges: [
    {
      id: "A#B#0",
      source: "A",
      target: "B",
      sourceHandle: "A#source#0",
      targetHandle: "B#target#0",
    },
    {
      id: "A#D#1",
      source: "A",
      target: "D",
      sourceHandle: "A#source#1",
      targetHandle: "D#target#0",
    },
    {
      id: "A#C#2",
      source: "A",
      target: "C",
      sourceHandle: "A#source#2",
      targetHandle: "C#target#0",
    },
    {
      id: "E#F#0",
      source: "E",
      target: "F",
      sourceHandle: "E#source#0",
      targetHandle: "F#target#0",
    },
    {
      id: "E#4#1",
      source: "E",
      target: "4",
      sourceHandle: "E#source#0",
      targetHandle: "4#target#0",
    },
  ],
});