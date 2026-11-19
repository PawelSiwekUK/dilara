import { ArchiveBlock } from '@/src/blocks/ArchiveBlock/Component'
import { BannerBlock } from '@/src/blocks/Banner/Component'
import { CallToActionBlock } from '@/src/blocks/CallToAction/Component'
import { CarouselBlock } from '@/src/blocks/Carousel/Component'
import { ContentBlock } from '@/src/blocks/Content/Component'
import { FormBlock } from '@/src/blocks/Form/Component'
import { MediaBlock } from '@/src/blocks/MediaBlock/Component'
import { ThreeItemGridBlock } from '@/src/blocks/ThreeItemGrid/Component'
import { toKebabCase } from '@/src/utilities/toKebabCase'
import React, { Fragment } from 'react'

import type { Page } from '../payload-types'

const blockComponents = {
  archive: ArchiveBlock,
  banner: BannerBlock,
  carousel: CarouselBlock,
  content: ContentBlock,
  cta: CallToActionBlock,
  formBlock: FormBlock,
  mediaBlock: MediaBlock,
  threeItemGrid: ThreeItemGridBlock,
}

export const RenderBlocks: React.FC<{
  blocks: Page['layout'][0][]
}> = (props) => {
  const { blocks } = props

  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0

  if (hasBlocks) {
    return (
      <Fragment>
        {blocks.map((block, index) => {
          const { blockName, blockType } = block

          if (blockType && blockType in blockComponents) {
            const Block = blockComponents[blockType]

            if (Block) {
              return (
                <div className="my-16" key={index}>
                  {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                  {/* @ts-ignore - weird type mismatch here */}
                  <Block id={toKebabCase(blockName!)} {...block} />
                </div>
              )
            }
          }
          return null
        })}
      </Fragment>
    )
  }

  return null
}
