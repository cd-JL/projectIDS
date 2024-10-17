import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React from "react";
import ChartOne from "@/components/Charts/ChartOne";
import { PrismaClient, vulnerabilities } from "@prisma/client";

export const metadata: Metadata = {
  title: "Next.js Chart | TailAdmin - Next.js Dashboard Template",
  description:
    "This is Next.js Chart page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
}

const prisma = new PrismaClient()

async function BasicChartPage() {

const data = await prisma.vulnerabilities.findMany({})

  return (
    <DefaultLayout>
      {
        data.map((item: vulnerabilities) => {
          return item.vulnerabilities.map(v => {

            const data = v.cve.metrics.cvssMetricV31.map(s => s.exploitabilityScore)
            const value = v.cve.metrics.cvssMetricV31.map(s => s.impactScore.toString())

            return <ChartOne key={item.id} data={data} labels={value}/> // x axis is impactScore, y is exploitability score
          })
        })
      }
    </DefaultLayout>
  );
};

export default BasicChartPage;
