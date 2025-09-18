import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { resolveRelative, SimpleSlug } from "../util/path"
import { QuartzPluginData } from "../plugins/vfile"
import { byDateAndAlphabetical } from "./PageList"
import { Date, getDate } from "./Date"
import { GlobalConfiguration } from "../cfg"
import { classNames } from "../util/lang"
import style from "./styles/landingPage.scss"

interface Options {
  recentNotesLimit: number
  showTags: boolean
  filter: (f: QuartzPluginData) => boolean
  sort: (f1: QuartzPluginData, f2: QuartzPluginData) => number
}

const defaultOptions = (cfg: GlobalConfiguration): Options => ({
  recentNotesLimit: 6,
  showTags: true,
  filter: (f) => f.slug !== "index",
  sort: byDateAndAlphabetical(cfg),
})

export default ((userOpts?: Partial<Options>) => {
  const LandingPage: QuartzComponent = ({
    allFiles,
    fileData,
    cfg,
  }: QuartzComponentProps) => {
    const opts = { ...defaultOptions(cfg), ...userOpts }
    const pages = allFiles.filter(opts.filter).sort(opts.sort)

    // Get recent notes
    const recentNotes = pages.slice(0, opts.recentNotesLimit)

    // Get tag statistics
    const tagMap = new Map<string, number>()
    pages.forEach(page => {
      const tags = page.frontmatter?.tags ?? []
      tags.forEach(tag => {
        tagMap.set(tag, (tagMap.get(tag) || 0) + 1)
      })
    })

    const topTags = Array.from(tagMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)

    // Get folders/categories
    const folders = new Set<string>()
    pages.forEach(page => {
      const slug = page.slug || ""
      const pathParts = slug.split("/")
      if (pathParts.length > 1) {
        folders.add(pathParts[0])
      }
    })

    const totalNotes = pages.length
    const totalTags = tagMap.size

    return (
      <div class={classNames("landing-page")}>
        {/* Hero Section */}
        <section class="hero">
          <div class="hero-content">
            <h1 class="hero-title">Welcome to My Digital Garden</h1>
            <p class="hero-subtitle">
              A collection of thoughts, ideas, and learnings that grow over time.
              This is my personal knowledge base where ideas connect and evolve.
            </p>
            <div class="hero-stats">
              <div class="stat">
                <span class="stat-number">{totalNotes}</span>
                <span class="stat-label">Notes</span>
              </div>
              <div class="stat">
                <span class="stat-number">{totalTags}</span>
                <span class="stat-label">Tags</span>
              </div>
            </div>
          </div>
        </section>

        {/* Recent Notes */}
        <section class="recent-notes-section">
          <div class="section-header">
            <h2>Recent Notes</h2>
            {Array.from(folders).map(folder => (
              <a href={resolveRelative(fileData.slug!, folder as SimpleSlug)} class="see-all">
                View All →
              </a>
            ))}
          </div>
          <div class="notes-grid">
            {recentNotes.map((page) => {
              const title = page.frontmatter?.title ?? "Untitled"
              const tags = page.frontmatter?.tags ?? []
              const description = page.frontmatter?.description ??
                page.description ??
                "No description available"

              return (
                <article class="note-card">
                  <div class="note-content">
                    <h3 class="note-title">
                      <a href={resolveRelative(fileData.slug!, page.slug!)} class="internal">
                        {title}
                      </a>
                    </h3>
                    <p class="note-description">{description}</p>
                    {page.dates && (
                      <div class="note-meta">
                        <Date date={getDate(cfg, page)!} locale={cfg.locale} />
                      </div>
                    )}
                    {opts.showTags && tags.length > 0 && (
                      <div class="note-tags">
                        {tags.slice(0, 3).map((tag) => (
                          <a
                            class="tag-pill"
                            href={resolveRelative(fileData.slug!, `tags/${tag}` as SimpleSlug)}
                          >
                            {tag}
                          </a>
                        ))}
                        {tags.length > 3 && <span class="tag-more">+{tags.length - 3}</span>}
                      </div>
                    )}
                  </div>
                </article>
              )
            })}
          </div>
        </section>

        {/* Popular Tags */}
        <section class="popular-tags">
          <h2>Popular Topics</h2>
          <div class="tags-cloud">
            {topTags.map(([tag, count]) => (
              <a
                href={resolveRelative(fileData.slug!, `tags/${tag}` as SimpleSlug)}
                class="tag-cloud-item"
                style={`--tag-size: ${Math.min(2.5, 1 + (count / Math.max(...topTags.map(t => t[1]))))}`}
              >
                {tag}
                <span class="tag-count">({count})</span>
              </a>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section class="cta">
          <div class="cta-content">
            <h2>Start Exploring</h2>
            <p>
              Dive into my collection of notes and discover connections between ideas.
              Use the search or browse by tags to find what interests you.
            </p>
          </div>
        </section>
      </div>
    )
  }

  LandingPage.css = style
  return LandingPage
}) satisfies QuartzComponentConstructor