"use client";

export default function Skills() {
  const skills = [
    "JavaScript", "TypeScript", "Node.js", "Next.js", "PHP",
    "Redes e Shell", "HTML", "CSS", "React", "Git",
    "MySQL", "MongoDB", "GCP", "AWS", "Kubernetes",
    "CI/CD", "Testes Unitários", "Java", "Python", "C#",
    "C++"
  ];

  return (
    <section id="skills" className="mb-20">
      <h3 className="text-2xl font-semibold mb-6 border-b border-neutral-800 pb-2">Skills</h3>
      <ul className="flex flex-wrap gap-4 text-sm text-neutral-400 justify-center mt-4">
        {skills.map((skill, index) => (
          <li
            key={index}
            className="bg-neutral-900 px-4 py-1 rounded-full hover:text-cyan-400 transition"
          >
            {skill}
          </li>
        ))}
      </ul>
    </section>
  );
}
