'use client'

import Image from 'next/image'
import { useState } from 'react'

interface Certificate {
  file: string
  title: string
  issuer: string
  skills: string[]
}

const certificates: Certificate[] = [
  {
    file: 'CERTIFICATE_LANDING_PAGE~B1XVW0RBGODD.jpeg',
    title: 'AI for Research and Insights',
    issuer: 'Google',
    skills: ['Generative AI', 'Gemini', 'AI Workflows', 'Responsible AI', 'Research', 'Data Presentation', 'Artificial Intelligence'],
  },
  {
    file: 'CERTIFICATE_LANDING_PAGE~BIDPEKG9ANFT.jpeg',
    title: 'AI for Data Analysis',
    issuer: 'Google',
    skills: ['Data Analysis', 'Trend Analysis', 'Generative AI', 'Responsible AI', 'Big Data', 'Gemini', 'Data Visualization'],
  },
  {
    file: 'CERTIFICATE_LANDING_PAGE~EV4LHZSZN7A5.jpeg',
    title: 'AI for Brainstorming and Planning',
    issuer: 'Google',
    skills: ['Planning', 'Gemini', 'Brainstorming', 'Project Management', 'Generative AI', 'LLM Application', 'Responsible AI'],
  },
  {
    file: 'CERTIFICATE_LANDING_PAGE~HSZEJ2LQ6WYJ.jpeg',
    title: 'AI for App Building',
    issuer: 'Google',
    skills: ['Process Analysis', 'Artificial Intelligence', 'Google Cloud Platform', 'Google Gemini', 'Vibe coding', 'Responsible AI', 'Natural Language Processing'],
  },
  {
    file: 'CERTIFICATE_LANDING_PAGE~MRVR7PLT342M.jpeg',
    title: 'AI for Writing and Communicating',
    issuer: 'Google',
    skills: ['Artificial Intelligence', 'Responsible AI', 'Generative AI', 'Google Workspace', 'Writing and Editing', 'Oral Expression', 'Gemini'],
  },
  {
    file: 'CERTIFICATE_LANDING_PAGE~U663VWDL5450.jpeg',
    title: 'AI for Content Creation',
    issuer: 'Google',
    skills: ['Gemini', 'Google Gemini', 'Design Reviews', 'Style Guides', 'Prompt Engineering', 'Video Production', 'Content Creation', 'AI Enablement', 'Responsible AI', 'Brand Management'],
  },
  {
    file: 'CERTIFICATE_LANDING_PAGE~ZBMLA2YRUPPE.jpeg',
    title: 'AI Fundamentals',
    issuer: 'Google',
    skills: ['Responsible AI', 'Artificial Intelligence', 'Business Writing', 'Machine Learning', 'Gemini', 'Generative AI', 'Multimodal Prompts', 'Technical Writing'],
  },
  {
    file: 'certificate-2e3d8ftpyay5-1774362436.jpg',
    title: 'Промпт дизайн в Vertex AI',
    issuer: 'Google Cloud',
    skills: ['Vertex AI', 'Prompt Engineering', 'Generative AI', 'Google Cloud'],
  },
  {
    file: 'certificate-58oqozbbyqh5-1773148119.jpg',
    title: 'Introduction to Generative AI',
    issuer: 'Google Cloud',
    skills: ['Generative AI', 'Large Language Models', 'Google Cloud', 'AI Fundamentals'],
  },
  {
    file: 'certificate-5kjfqqzf3rei-1774363013.jpg',
    title: 'Introduction to Large Language Models',
    issuer: 'Google Cloud',
    skills: ['Large Language Models', 'Generative AI', 'NLP', 'Google Cloud'],
  },
  {
    file: 'certificate-a7pakvhco7d8-1774366174.jpg',
    title: 'Encoder-Decoder Architecture',
    issuer: 'Google Cloud',
    skills: ['Deep Learning', 'Neural Networks', 'Encoder-Decoder', 'Google Cloud'],
  },
  {
    file: 'certificate-dm93fbrp5qko-1774362692.jpg',
    title: 'Attention Mechanism',
    issuer: 'Google Cloud',
    skills: ['Attention Mechanism', 'Transformers', 'Deep Learning', 'Google Cloud'],
  },
  {
    file: 'certificate-hjh4tcxqdtre-1774372259.jpg',
    title: 'Transformer Models and BERT Model',
    issuer: 'Google Cloud',
    skills: ['BERT', 'Transformers', 'NLP', 'Google Cloud'],
  },
  {
    file: 'certificate-ic8rqdieaw4z-1774360435.jpg',
    title: 'Introduction to Responsible AI',
    issuer: 'Google Cloud',
    skills: ['Responsible AI', 'AI Ethics', 'Google Cloud', 'AI Safety'],
  },
  {
    file: 'certificate-ij53dqsskkm7-1774372040.jpg',
    title: 'Create Image Captioning Models',
    issuer: 'Google Cloud',
    skills: ['Computer Vision', 'Image Captioning', 'Deep Learning', 'Google Cloud'],
  },
  {
    file: 'certificate-ku6ck3v55z9e-1774365377.jpg',
    title: 'Introduction to Image Generation',
    issuer: 'Google Cloud',
    skills: ['Image Generation', 'Diffusion Models', 'Generative AI', 'Google Cloud'],
  },
  {
    file: 'certificate-q7vmtqnyutvh-1773148534.jpg',
    title: 'Introduction to Responsible AI',
    issuer: 'Google Cloud',
    skills: ['Responsible AI', 'AI Ethics', 'Google Cloud'],
  },
  {
    file: 'certificate-qapt4hihxbf9-1774362537.jpg',
    title: 'Generative AI Fundamentals',
    issuer: 'Google Cloud',
    skills: ['Generative AI', 'Large Language Models', 'Google Cloud', 'AI Fundamentals'],
  },
  {
    file: 'certificate-ry7baqoc3cey-1774366249.jpg',
    title: 'Introduction to Generative AI Studio',
    issuer: 'Google Cloud',
    skills: ['Generative AI Studio', 'Vertex AI', 'Google Cloud', 'Prompt Engineering'],
  },
  {
    file: 'certificate-t7gjrfaz325b-1774365851.jpg',
    title: 'Attention Mechanism',
    issuer: 'Google Cloud',
    skills: ['Attention Mechanism', 'Neural Networks', 'Deep Learning', 'Google Cloud'],
  },
  {
    file: 'certificate-tsf4snf7tft3-1774366321 (1).jpg',
    title: 'Build and Deploy ML Solutions on Vertex AI',
    issuer: 'Google Cloud',
    skills: ['Vertex AI', 'MLOps', 'Model Deployment', 'Google Cloud'],
  },
  {
    file: 'certificate-ydchbog97e2v-1774367431.jpg',
    title: 'Responsible AI: Applying AI Principles with Google Cloud',
    issuer: 'Google Cloud',
    skills: ['Responsible AI', 'AI Principles', 'AI Ethics', 'Google Cloud'],
  },
]

// Deduplicate by file (remove (1) duplicates)
const uniqueCertificates = certificates.filter(
  (cert, index, self) =>
    index === self.findIndex((c) => c.title === cert.title)
)

export function AboutCertificates() {
  const [selected, setSelected] = useState<Certificate | null>(null)

  return (
    <section className="py-24 border-b border-white/5">
      <div className="container mx-auto px-6 lg:px-12 max-w-360">
        <h2 className="text-3xl font-bold tracking-tight mb-4">
          <span className="text-primary">სერტიფიკატები</span>
        </h2>
        <p className="text-muted-foreground mb-12">Google & Google Cloud — Coursera</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {uniqueCertificates.map((cert) => (
            <button
              key={cert.file}
              onClick={() => setSelected(cert)}
              className="group text-left rounded-xl border border-white/5 bg-muted/20 hover:border-primary/30 hover:bg-primary/5 transition-colors duration-300 overflow-hidden focus:outline-none focus:ring-2 focus:ring-primary/50"
              aria-label={`სერტიფიკატი: ${cert.title}`}
            >
              {/* Certificate Image */}
              <div className="relative aspect-4/3 overflow-hidden">
                <Image
                  src={`/certificates/${cert.file}`}
                  alt={cert.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
              </div>

              {/* Info */}
              <div className="p-4 space-y-3">
                <div>
                  <p className="text-xs text-primary font-medium mb-1">{cert.issuer}</p>
                  <h3 className="font-semibold text-sm leading-snug">{cert.title}</h3>
                </div>

                {/* Skills */}
                <div className="flex flex-wrap gap-1">
                  {cert.skills.slice(0, 4).map((skill) => (
                    <span
                      key={skill}
                      className="text-xs px-2 py-0.5 rounded-full bg-muted/60 text-muted-foreground border border-white/5"
                    >
                      {skill}
                    </span>
                  ))}
                  {cert.skills.length > 4 && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-muted/60 text-muted-foreground border border-white/5">
                      +{cert.skills.length - 4}
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="relative bg-card border border-white/10 rounded-2xl overflow-hidden max-w-3xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              onClick={() => setSelected(null)}
              className="absolute top-3 right-3 z-10 text-muted-foreground hover:text-foreground bg-black/40 rounded-full w-8 h-8 flex items-center justify-center text-lg"
              aria-label="დახურვა"
            >
              ✕
            </button>

            {/* Image */}
            <div className="relative aspect-4/3 w-full">
              <Image
                src={`/certificates/${selected.file}`}
                alt={selected.title}
                fill
                className="object-contain"
              />
            </div>

            {/* Details */}
            <div className="p-6 space-y-3 border-t border-white/5">
              <p className="text-sm text-primary font-medium">{selected.issuer}</p>
              <h3 className="text-xl font-bold">{selected.title}</h3>
              <div className="flex flex-wrap gap-2">
                {selected.skills.map((skill) => (
                  <span
                    key={skill}
                    className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
