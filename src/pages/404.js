//** @jsx jsx */
import React from "react";

import { SEO } from "@modules/utility";
import { Box, Flex, Text, Image, jsx } from "theme-ui";
import { useStaticQuery, graphql } from "gatsby";
import { MDXRenderer } from "gatsby-plugin-mdx";
import { navigate } from "@reach/router";
import Button from "@modules/ui/Button";

import { useTranslation } from "@modules/localization";

const browser = typeof window !== "undefined" && window; //<- This is to stop 404 flashes on route fallbacks.

//404Page Wrapper
const PageLayout = ({ children, seoTitle, t }) => (
  <Flex
    sx={{
      width: "100%",
      justifyContent: "center",
      alignItems: "center",
      py: "77px",
    }}
  >
    <SEO title={seoTitle} />
    <Flex
      sx={{
        flex: 2,
        flexDirection: "column",
        p: "5%",
        width: "100%",
        display: "inline-block",
      }}
    >
      {children}
      <Box>
        <Button
          to={"https://github.com/makerdao/community-portal/issues"}
          sx={{
            display: "inline-block",
            mt: "5px",
          }}
        >
          {t("Bug_Report")}
        </Button>
        <Text
          onClick={() => {
            navigate(-1);
          }}
          disabled={true}
          hideExternalIcon={true}
          sx={{
            fontWeight: "bold",
            display: "inline-block",
            ml: "15px",
            cursor: "pointer",
          }}
        >
          {t("Go_Back")}
        </Text>
      </Box>
    </Flex>
    <Image
      sx={{ width: "400px", height: "400px", display: "inline-block" }}
      src={
        "https://cdn.shopify.com/s/files/1/0010/0994/2575/products/2046-60-mistyteal_3472a883-658e-4f06-b350-387a8eafa4ae_2000x.png"
      }
    />
  </Flex>
);

const NotFoundPage = () => {
  const { locale, t } = useTranslation();
  //NOTE(Rejon): I could do a gatsby-node and programmatically create these pages.
  //             But there's a chance that a missing 404 in the content folder will break the app.
  //             I'll take the L.
  const { allMdx: nodes } = useStaticQuery(graphql`
    query Get404Pages {
      allMdx(
        filter: { fileAbsolutePath: { regex: "//([\\\\w]{2})/404.mdx$/" } }
      ) {
        nodes {
          headings(depth: h1) {
            value
          }
          fileAbsolutePath
          body
          frontmatter {
            title
          }
        }
      }
    }
  `);

  if (!browser) {
    return <></>;
  }

  const page = nodes.nodes.find(
    ({ fileAbsolutePath }) => fileAbsolutePath.indexOf(`/${locale}/`) !== -1
  );

  const title = page && page.frontmatter ? page.frontmatter.title : null;
  const firstHeading =
    page && page.headings.length > 0 ? page.headings[0].value : null;

  //Use the Title Rule. Else just use a hardcoded value.
  const seoTitle = title || firstHeading || t("404");

  return (
    <PageLayout seoTitle={seoTitle} t={t}>
      {page ? (
        <MDXRenderer>{page.body}</MDXRenderer>
      ) : (
        <Box sx={{ fontSize: "1.5em" }}>
          <Text sx={{ fontSize: "2em", mt: "1em", mb: ".75em" }}>404</Text>
          <Box sx={{ mt: "1em", mb: "1em" }}>
            Uh oh, the page you're looking for doesn't exist.
            <br />
            <br />
            Think something's broken on our end?
          </Box>
        </Box>
      )}
    </PageLayout>
  );
};
export default NotFoundPage;
