import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Cpu,
  UserCheck,
  FileSearch,
  PenTool,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const aiTasks = [
  {
    icon: Cpu,
    title: 'Categorization and tagging.',
    description:
      'Bank lines, expense lines, GL entries. AI proposes categories. A senior reviewer signs off.',
  },
  {
    icon: PenTool,
    title: 'First-draft commentary.',
    description:
      'Variance explanations, MIS narratives, board-pack write-ups. AI drafts from your numbers. We edit, fact-check, and add the context AI cannot know.',
  },
  {
    icon: FileSearch,
    title: 'Reconciliation acceleration.',
    description:
      'Pattern matching across statements, ledgers, and invoices. AI flags mismatches. We investigate.',
  },
  {
    icon: AlertCircle,
    title: 'Analysis acceleration.',
    description:
      'Cohort cuts, segment math, scenario builds. AI handles the mechanical work. We interpret.',
  },
];

const humanTasks = [
  {
    icon: UserCheck,
    title: 'Review and sign-off on every deliverable.',
    description:
      'Nothing leaves SK Capital without a senior finance professional reading it line by line.',
  },
  {
    icon: UserCheck,
    title: 'Client-facing communication.',
    description:
      'Calls, emails, meetings, advice. You talk to people, not models.',
  },
  {
    icon: UserCheck,
    title: 'Judgment calls.',
    description:
      "What's a real cost cut versus a false economy. Whether a number means something. Whether a forecast assumption holds.",
  },
  {
    icon: UserCheck,
    title: 'Anomaly investigation.',
    description:
      'When something looks off, a human digs in. AI is a starting point, not an answer.',
  },
];

export default function HowWeUseAI() {
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.ai-header', {
        y: 30, opacity: 0, duration: 0.8, ease: 'power2.out',
        scrollTrigger: { trigger: pageRef.current, start: 'top 80%' },
      });
      gsap.from('.ai-section', {
        y: 30, opacity: 0, duration: 0.7, stagger: 0.15, ease: 'power2.out',
        scrollTrigger: { trigger: '.ai-content', start: 'top 80%' },
      });
      gsap.from('.ai-task', {
        x: -20, opacity: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out',
        scrollTrigger: { trigger: '.ai-tasks', start: 'top 80%' },
      });
      gsap.from('.human-task', {
        x: 20, opacity: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out',
        scrollTrigger: { trigger: '.human-tasks', start: 'top 80%' },
      });
    }, pageRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={pageRef} className="pt-24 lg:pt-32 pb-16">
      <div className="w-full px-6 lg:px-12 xl:px-20 max-w-5xl mx-auto">
        {/* Header */}
        <div className="ai-header mb-12 lg:mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-px bg-gold" />
            <span className="text-xs uppercase tracking-[0.18em] text-gold font-ui">
              Transparency
            </span>
          </div>
          <h1 className="font-display text-3xl lg:text-5xl text-warm mb-6">
            AI is a tool. Judgment is ours.
          </h1>
          <p className="text-lg text-cool leading-relaxed max-w-3xl">
            We&apos;re a finance advisory firm that uses AI to move faster on the
            work that doesn&apos;t require judgment, and slower on the work that
            does. This page covers what AI does in our workflow, what we don&apos;t
            let it do, how we handle your data, and which models we use.
          </p>
        </div>

        <div className="ai-content space-y-16 lg:space-y-20">
          {/* What AI Does */}
          <div className="ai-section">
            <div className="flex items-center gap-4 mb-8">
              <span className="text-4xl lg:text-5xl font-display text-gold/30">
                01
              </span>
              <h2 className="font-display text-2xl lg:text-3xl text-warm">
                What AI does in our workflow
              </h2>
            </div>
            <p className="text-cool leading-relaxed mb-8 border-l-2 border-gold/30 pl-6 italic">
              AI helps us compress the time between data and insight. The faster
              we get to a clean draft, the more time we spend on what matters:
              judgment, context, and what you should do next.
            </p>

            <div className="ai-tasks space-y-6">
              {aiTasks.map((task, index) => {
                const Icon = task.icon;
                return (
                  <div
                    key={index}
                    className="ai-task flex items-start gap-4 p-5 bg-navy-light border border-white/8 rounded-xl hover:border-gold/20 transition-all"
                  >
                    <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center flex-shrink-0">
                      <Icon size={20} className="text-gold" />
                    </div>
                    <div>
                      <h3 className="font-medium text-warm mb-1">
                        {task.title}
                      </h3>
                      <p className="text-sm text-cool leading-relaxed">
                        {task.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* What Humans Always Do */}
          <div className="ai-section">
            <div className="flex items-center gap-4 mb-8">
              <span className="text-4xl lg:text-5xl font-display text-gold/30">
                02
              </span>
              <h2 className="font-display text-2xl lg:text-3xl text-warm">
                What humans always do
              </h2>
            </div>
            <p className="text-cool leading-relaxed mb-8 border-l-2 border-gold/30 pl-6 italic">
              These are the parts we never delegate to AI. Not because AI
              cannot do them, but because the value of finance advisory comes
              from the judgment behind each decision.
            </p>

            <div className="human-tasks space-y-6">
              {humanTasks.map((task, index) => {
                const Icon = task.icon;
                return (
                  <div
                    key={index}
                    className="human-task flex items-start gap-4 p-5 bg-navy-light border border-white/8 rounded-xl hover:border-gold/20 transition-all"
                  >
                    <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center flex-shrink-0">
                      <Icon size={20} className="text-gold" />
                    </div>
                    <div>
                      <h3 className="font-medium text-warm mb-1">
                        {task.title}
                      </h3>
                      <p className="text-sm text-cool leading-relaxed">
                        {task.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Data Privacy */}
          <div className="ai-section">
            <div className="flex items-center gap-4 mb-8">
              <span className="text-4xl lg:text-5xl font-display text-gold/30">
                03
              </span>
              <h2 className="font-display text-2xl lg:text-3xl text-warm">
                Your data stays yours
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-5 bg-navy-light border border-white/8 rounded-xl">
                <h3 className="font-medium text-warm mb-2">
                  No training on your data
                </h3>
                <p className="text-sm text-cool leading-relaxed">
                  Your financial data is never used to train AI models. We use
                  enterprise-grade AI tools with zero-retention policies.
                </p>
              </div>
              <div className="p-5 bg-navy-light border border-white/8 rounded-xl">
                <h3 className="font-medium text-warm mb-2">
                  Enterprise security
                </h3>
                <p className="text-sm text-cool leading-relaxed">
                  All data is encrypted in transit and at rest. We sign NDAs by
                  default and follow SOC 2 aligned practices.
                </p>
              </div>
              <div className="p-5 bg-navy-light border border-white/8 rounded-xl">
                <h3 className="font-medium text-warm mb-2">
                  Clear data handling
                </h3>
                <p className="text-sm text-cool leading-relaxed">
                  We only access the financial data you explicitly share. No
                  bank credentials, no direct system integrations without
                  consent.
                </p>
              </div>
              <div className="p-5 bg-navy-light border border-white/8 rounded-xl">
                <h3 className="font-medium text-warm mb-2">
                  Human-in-the-loop
                </h3>
                <p className="text-sm text-cool leading-relaxed">
                  Every AI-assisted output is reviewed by a senior finance
                  professional before it reaches you.
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center pt-8 border-t border-white/8">
            <p className="text-cool mb-6">
              Have questions about how we handle your data?
            </p>
            <a
              href="https://cal.com/skcapital/free-financial-breakdown"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-gold text-navy font-medium rounded-full hover:bg-gold/90 transition-all hover:-translate-y-0.5"
            >
              Book a Free Finance Systems Review
              <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
