import { ArrowRight, Flame, Leaf, Star } from 'lucide-react'
import { Link } from 'react-router-dom'

const categories = [
  { label: 'Momo & dumplings', count: 12 },
  { label: 'Sekuwa & grill', count: 8 },
  { label: 'Dal bhat sets', count: 6 },
  { label: 'Newari khaja', count: 9 },
  { label: 'Chiya & drinks', count: 7 },
]

const featured = [
  {
    name: 'Chicken Sekuwa',
    tag: 'Smoky favourite',
    price: 350,
    icon: Flame,
  },
  {
    name: 'Veg Momo',
    tag: "Chef's pick",
    price: 150,
    icon: Leaf,
  },
  {
    name: 'Newari Khaja Set',
    tag: 'Top rated',
    price: 450,
    icon: Star,
  },
]

function Home() {
  return (
    <div className="bg-cream">
      {/* ── Hero ── */}
      <section className="relative px-6 pt-20 pb-24 md:pt-28 md:pb-32 max-w-5xl mx-auto">
        <p className="font-body text-sm tracking-[0.2em] uppercase text-chili font-semibold mb-6">
          Biratnagar's table, delivered
        </p>

        <h1 className="font-display text-[15vw] leading-[0.92] md:text-[6.5rem] font-bold text-ink tracking-tight">
          Eat what
          <br />
          this city
          <br />
          actually cooks.
        </h1>

        <div className="mt-8 max-w-md">
          <div className="h-0.75 w-24 bg-chili mb-6" style={{
            maskImage: 'linear-gradient(90deg, black 0%, black 70%, transparent 100%)',
          }} />
          <p className="font-body text-ink/70 text-lg leading-relaxed">
            Momo from the corner steamer, sekuwa off the coal,
            dal bhat the way your hajurama makes it. No stock photos,
            no fusion nonsense — just the menu Biratnagar already loves.
          </p>
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <Link
            to="/menu"
            className="group inline-flex items-center gap-2 bg-ink text-cream font-body font-semibold px-7 py-4 rounded-sm hover:bg-chili transition-colors duration-200"
          >
            See today's menu
            <ArrowRight
              size={18}
              className="group-hover:translate-x-1 transition-transform duration-200"
            />
          </Link>
          <Link
            to="/register"
            className="font-body font-semibold text-ink/70 hover:text-ink px-2 py-4 underline decoration-clay decoration-2 underline-offset-4 hover:decoration-chili transition-colors"
          >
            Create an account
          </Link>
        </div>
      </section>

      {/* ── Category strip — stamped tags ── */}
      <section className="border-y border-clay bg-clay-light/40">
        <div className="max-w-5xl mx-auto px-6 py-5 flex flex-wrap gap-3">
          {categories.map((cat) => (
            <Link
              key={cat.label}
              to="/menu"
              className="group inline-flex items-center gap-2 bg-cream border border-ink/15 px-4 py-2 rounded-full font-body text-sm font-medium text-ink/80 hover:border-chili hover:text-chili transition-colors"
            >
              {cat.label}
              <span className="text-ink/40 group-hover:text-chili/60 text-xs">
                {cat.count}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Featured — menu-board cards ── */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <div className="flex items-baseline justify-between mb-10">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-ink">
            On the board today
          </h2>
          <Link
            to="/menu"
            className="font-body text-sm font-semibold text-chili hover:text-chili-dark hidden md:inline"
          >
            Full menu →
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-px bg-ink/10 border border-ink/10">
          {featured.map((item) => {
            const Icon = item.icon
            return (
              <div
                key={item.name}
                className="bg-cream p-8 hover:bg-clay-light/50 transition-colors group cursor-pointer"
              >
                <Icon
                  size={22}
                  className="text-chili mb-6"
                  strokeWidth={1.75}
                />
                <p className="font-body text-xs uppercase tracking-wider text-cardamom font-semibold mb-2">
                  {item.tag}
                </p>
                <h3 className="font-display text-2xl font-semibold text-ink mb-3">
                  {item.name}
                </h3>
                <p className="font-body text-ink/60 font-medium">
                  Rs. {item.price}
                </p>
              </div>
            )
          })}
        </div>
      </section>

      {/* ── Closing strip ── */}
      <section className="bg-ink text-cream px-6 py-16">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <h2 className="font-display text-3xl md:text-4xl font-semibold max-w-md">
            Hungry already?
            Good — that was the plan.
          </h2>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 bg-turmeric text-ink font-body font-semibold px-7 py-4 rounded-sm hover:bg-cream transition-colors whitespace-nowrap"
          >
            Get started
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Home