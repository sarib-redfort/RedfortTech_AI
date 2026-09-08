import { Service } from "../types";

export const services: Service[] = [
  {
    id: "full-stack-development",
    title: "Full Stack Development",
    icon: "Code",
    image: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=800",
    shortDescription: "Robust, high-performance web applications using modern, enterprise-ready tech stacks.",
    longDescription: "RedFort AI delivers robust, high-performance Full Stack Development solutions. We build web applications using modern, enterprise-ready tech stacks like React, Next.js, and TypeScript, ensuring scalability, performance, and clean architecture from the front-end to the back-end database layer to accelerate digital transformation.",
    features: [
      "Enterprise Web Applications",
      "SaaS Platform Development",
      "API Development & Integration",
      "Scalable Software Architecture"
    ],
    technologies: ["React", "TypeScript", "Next.js", "Node.js", "PostgreSQL", "Tailwind CSS", "Express"]
  },
  {
    id: "ai-ml",
    title: "Artificial Intelligence & Machine Learning",
    icon: "Brain",
    image: "https://images.unsplash.com/photo-1677442136019-21780efad99a?q=80&w=800",
    shortDescription: "Custom machine learning models, neural networks, and predictive systems built for enterprise.",
    longDescription: "Our Artificial Intelligence & Machine Learning division engineers custom machine learning models, natural language processing pipelines, computer vision systems, and predictive analytics engines. These solutions enable AI-driven decision making and help global enterprises solve specific, high-value business challenges.",
    features: [
      "Predictive Analytics Models",
      "Computer Vision Systems",
      "Natural Language Processing (NLP)",
      "AI-Driven Decision Making"
    ],
    technologies: ["Python", "TensorFlow", "PyTorch", "Hugging Face", "Scikit-Learn"]
  },
  {
    id: "business-automation",
    title: "Business Automation",
    icon: "Bot",
    image: "https://images.unsplash.com/photo-1531747118685-ca8fa6e08806?q=80&w=800",
    shortDescription: "Intelligent agentic workflows and automated process systems to reduce operational costs.",
    longDescription: "We deliver comprehensive Business Automation solutions to eliminate repetitive administrative friction, reduce manual paperwork, improve employee productivity, and optimize operational workflows. Our intelligent automation architectures allow enterprise teams to focus on strategic initiatives.",
    features: [
      "Reduce Manual Paperwork",
      "Workflow Automation & Flows",
      "Process Optimization Algorithms",
      "Robotic Process Automation (RPA)"
    ],
    technologies: ["LangChain", "Python", "Vector Databases", "n8n", "Docker"]
  },
  {
    id: "ai-full-stack-solutions",
    title: "AI Full Stack Solutions",
    icon: "Layers",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=800",
    shortDescription: "Complete product lifecycle integrating product design, front-to-back engineering, and AI pipelines.",
    longDescription: "Our AI Full Stack Solutions handle the entire product lifecycle from initial discovery and design to custom full-stack development, AI model integration, and secure, containerized cloud deployment to scale business operations and increase efficiency.",
    features: [
      "End-to-End AI Integration",
      "Accelerate Digital Transformation",
      "Scale Business Operations",
      "Increase Efficiency & Performance"
    ],
    technologies: ["TypeScript", "Docker", "AWS", "Figma", "Sentry", "Kubernetes"]
  }
];
