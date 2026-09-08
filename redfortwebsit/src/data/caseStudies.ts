import { CaseStudy } from "../types";

export const caseStudies: CaseStudy[] = [
  {
    id: "wealthai",
    title: "FinTech Portfolio Optimization (WealthAI)",
    image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=800",
    problem: "A major investment firm was struggling with high latency in portfolio rebalancing and poor predictive accuracy during volatile market events using traditional statistical tools.",
    solution: "We engineered WealthAI, a neural transformer pipeline that processes real-time global financial news and ticker data, recalculating risk frontiers in under 12 milliseconds.",
    technologyUsed: ["Python", "PyTorch", "Next.js", "PostgreSQL", "AWS SageMaker", "gRPC"],
    result: "Achieved a 34% reduction in asset drawdown and boosted annual portfolio yields by 4.2% across active funds.",
    statistics: "34% Drawdown Reduction",
    clientFeedback: "RedFort AI didn't just write code; they redefined our entire algorithmic approach. WealthAI operates flawlessly under pressure."
  },
  {
    id: "medscan-ai",
    title: "Healthcare Automated Diagnostic Portal (MedScan AI)",
    image: "https://images.unsplash.com/photo-1530026405186-ed1ea0ac7a63?q=80&w=800",
    problem: "Radiologists at a private clinic network were overwhelmed with routine chest X-ray scans, resulting in an average diagnosis delay of 18 hours.",
    solution: "We deployed a computer vision ensemble using convolutional neural networks (CNNs) that screens scans for 14 common abnormalities, highlighting high-priority scans for rapid review.",
    technologyUsed: ["TensorFlow", "React", "Node.js", "Docker", "Google Cloud Platform", "DICOM API"],
    result: "Reduced average triage response times from 18 hours down to 22 minutes for acute diagnostic cases.",
    statistics: "22-Minute Urgent Triage",
    clientFeedback: "MedScan AI acts as a reliable second pair of eyes. It has substantially reduced our clinical fatigue and improved overall diagnostic confidence."
  },
  {
    id: "aurashop",
    title: "E-Commerce Recommender System (AuraShop)",
    image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=800",
    problem: "An international premium clothing brand had a high customer cart abandonment rate (74%) due to generic, static web product listings.",
    solution: "We built a semantic cross-selling engine that analyzes individual clickstream paths and shopping histories, displaying tailored dynamic catalog carousels.",
    technologyUsed: ["TypeScript", "LangChain", "Node.js", "MongoDB", "Redis", "Vite"],
    result: "Boosted user add-to-cart conversions by 19% and grew average checkout value by 28% in 90 days.",
    statistics: "28% Higher Cart Value",
    clientFeedback: "The recommendation accuracy is astounding. Our customers are discovering items they actually want to buy, increasing organic loyalty."
  },
  {
    id: "routesmart",
    title: "Logistics Fleet Routing Optimizer (RouteSmart)",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=800",
    problem: "A regional delivery provider was incurring excessive fuel expenses due to inefficient delivery route path allocations across 400 active trucks.",
    solution: "We developed an operational algorithm utilizing combinatorial heuristics and real-time traffic telemetry to dynamically reroute active drivers.",
    technologyUsed: ["Python", "Rust", "React Native", "Google Maps Platform", "Kubernetes"],
    result: "Saved over 1.2 million gallons of fuel annually, shortening average delivery windows by 18%.",
    statistics: "18% Shorter Delivery Windows",
    clientFeedback: "RouteSmart took our dispatcher's headache away. Drivers have clear paths, and fuel cost charts are dropping consistently."
  },
  {
    id: "claritybot",
    title: "AI Autonomous Support Portal (ClarityBot)",
    image: "https://images.unsplash.com/photo-1531747118685-ca8fa6e08806?q=80&w=800",
    problem: "A software-as-a-service provider was scaling rapidly, leading to extreme support ticket queues that alienated enterprise accounts.",
    solution: "We created ClarityBot, an LLM-powered autonomous customer agent integrated with the client's internal product documentation databases via semantic RAG.",
    technologyUsed: ["Google GenAI SDK", "LangChain", "Vite", "Express", "Pinecone Vector DB"],
    result: "Successfully resolved 81% of incoming tier-1 support tickets instantly, maintaining a 94% approval rating.",
    statistics: "81% Automated Ticket Resolution",
    clientFeedback: "Our human agents can finally focus on deep enterprise accounts. ClarityBot handles standard technical inquiries with amazing grace."
  },
  {
    id: "gridsense",
    title: "Energy Intelligent Grid Regulator (GridSense)",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800",
    problem: "A metropolitan solar energy grid experienced recurring voltage surges and drops due to cloud coverage unpredictability.",
    solution: "We designed GridSense, an IoT telemetry processor that predicts localized sunlight drops using historical sensor and satellite forecasts, auto-adjusting storage flow.",
    technologyUsed: ["Python", "Scikit-Learn", "FastAPI", "InfluxDB", "Grafana", "AWS IoT Core"],
    result: "Stabilized network voltage within a safe 2% margin, preventing 11 major blackouts in trials.",
    statistics: "Zero Grid Surges in Trials",
    clientFeedback: "GridSense has made solar integration highly predictable. It is a massive step forward for our district energy reliability."
  },
  {
    id: "propvalue",
    title: "Real Estate Valuation Estimator (PropValue)",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=800",
    problem: "Commercial realtors were wasting days researching public records to draft property valuation estimates for institutional sellers.",
    solution: "We compiled a regression engine that aggregates tax records, localized flight frequencies, walking scores, and transaction histories, estimating valuations instantly.",
    technologyUsed: ["Python", "XGBoost", "React", "TypeScript", "PostgreSQL", "Mapbox"],
    result: "Achieved a 97.4% valuation accuracy matching final selling prices, slashing manual research times by 90%.",
    statistics: "90% Less Manual Research",
    clientFeedback: "An invaluable tool for our sales pitches. We can generate high-quality, data-supported appraisal drafts in minutes."
  },
  {
    id: "learnsync",
    title: "Educational Adaptive Portal (LearnSync)",
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=800",
    problem: "A large online tutoring institution noticed a drop in course completion rates due to fixed, non-engaging syllabus patterns.",
    solution: "We constructed LearnSync, which monitors individual student quiz speeds, review patterns, and click pauses, generating custom daily review questions.",
    technologyUsed: ["React", "Express", "Node.js", "MongoDB", "Python", "WebSockets"],
    result: "Improved overall curriculum course completion rates by 42% and student test scores by an average of 15%.",
    statistics: "42% Higher Course Completion",
    clientFeedback: "Students love the personalized focus. It makes learning feel highly customized and keeps engagement remarkably high."
  }
];
