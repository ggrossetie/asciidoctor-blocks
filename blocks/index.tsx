import { useEffect, useState } from "react";
import { FileBlockProps } from "@githubnext/blocks";
import { Box } from "@primer/react";
import  Asciidoctor from "@asciidoctor/core";
import resolveIncludes from "./includes";
import "./index.css";

const asciidoctor = Asciidoctor()

export default function AsciidoctorFileBlock(props: FileBlockProps & {files: { path: string, url: string }[]}) {
  const { content, files } = props;
  const filesMap = files.reduce((agg: {[key: string]: {path: string, url: string}}, current) => {
    agg[current.path] = current
    return agg
  }, {})

  const [asciidocContent, setAsciidocContent] = useState('');

  useEffect(() => {
    ;(async () => {
      const result = await resolveIncludes(content, filesMap)
      setAsciidocContent(result.join('\n'))
    })()
  })


  const html = asciidoctor.convert(asciidocContent, { attributes: { showTitle: true } }) as string

  return (
      <Box dangerouslySetInnerHTML={{__html: html}}/>
  );
}
