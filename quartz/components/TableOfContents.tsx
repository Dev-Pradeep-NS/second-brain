import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import legacyStyle from "./styles/legacyToc.scss"
import modernStyle from "./styles/toc.scss"
import { classNames } from "../util/lang"

// @ts-ignore
import script from "./scripts/toc.inline"
import { i18n } from "../i18n"
import OverflowListFactory from "./OverflowList"
import { concatenateResources } from "../util/resources"

interface Options {
  layout: "modern" | "legacy"
}

const defaultOptions: Options = {
  layout: "modern",
}

let numTocs = 0

export default ((opts?: Partial<Options>) => {
  const layout = opts?.layout ?? defaultOptions.layout
  const { OverflowList, overflowListAfterDOMLoaded } = OverflowListFactory()

  // Helper to generate hierarchical numbering strings for TOC items
  const generateNumbering = (toc: any[]) => {
    const counters: number[] = []
    return toc.map(item => {
      const depth = item.depth
      counters[depth] = (counters[depth] ?? 0) + 1
      // Reset counters deeper than current depth
      for (let i = depth + 1; i < counters.length; i++) {
        counters[i] = 0
      }
      // Compose numbering string for all depths up to current
      const numberingParts = counters.slice(0, depth + 1).filter(x => x > 0)
      let numbering = numberingParts.join(".")
      // Prefix top-level with 'Step '
      if (depth === 0) {
        numbering = "Step " + numbering
      }
      return { ...item, numbering: numbering + "." }
    })
  }

  const TableOfContents: QuartzComponent = ({
    fileData,
    displayClass,
    cfg,
  }: QuartzComponentProps) => {
    if (!fileData.toc) {
      return null
    }

    // Generate numbered TOC entries
    const numberedToc = generateNumbering(fileData.toc)

    const id = `toc-${numTocs++}`
    return (
      <div class={classNames(displayClass, "toc")}>
        <button class={classNames("toc-header", { collapsed: fileData.collapseToc })}>
          <h3>{i18n(cfg.locale).components.tableOfContents.title}</h3>
          <span class="fold"></span>
        </button>
        <OverflowList
          id={id}
          class="toc-content"
          style={fileData.collapseToc ? { display: "none" } : {}}
        >
          {numberedToc.map((tocEntry) => (
            <li key={tocEntry.slug} class={`depth-${tocEntry.depth}`}>
              <a href={`#${tocEntry.slug}`} data-for={tocEntry.slug}>
                {tocEntry.numbering && <span class="toc-number">{tocEntry.numbering}</span>}
                {tocEntry.text}
              </a>
            </li>
          ))}
        </OverflowList>
      </div>
    )
  }

  TableOfContents.css = modernStyle
  TableOfContents.afterDOMLoaded = concatenateResources(script, overflowListAfterDOMLoaded)

  const LegacyTableOfContents: QuartzComponent = ({ fileData, cfg }: QuartzComponentProps) => {
    if (!fileData.toc) {
      return null
    }

    const numberedToc = generateNumbering(fileData.toc)

    return (
      <details class="toc" open={!fileData.collapseToc}>
        <summary>
          <h3>{i18n(cfg.locale).components.tableOfContents.title}</h3>
        </summary>
        <ul>
          {numberedToc.map((tocEntry) => (
            <li key={tocEntry.slug} class={`depth-${tocEntry.depth}`}>
              <a href={`#${tocEntry.slug}`} data-for={tocEntry.slug}>
                {tocEntry.numbering && <span class="toc-number">{tocEntry.numbering}</span>}
                {tocEntry.text}
              </a>
            </li>
          ))}
        </ul>
      </details>
    )
  }
  LegacyTableOfContents.css = legacyStyle

  return layout === "modern" ? TableOfContents : LegacyTableOfContents
}) satisfies QuartzComponentConstructor
