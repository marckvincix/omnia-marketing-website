// google-trends-api non pubblica tipi propri (nessun @types/google-trends-api esiste):
// dichiarazione minima, limitata ai soli metodi/opzioni che usiamo davvero
// (src/lib/seo/trends.ts), non una copertura completa della libreria.
declare module "google-trends-api" {
  interface RelatedQueriesOptions {
    keyword: string;
    geo?: string;
    hl?: string;
    startTime?: Date;
    endTime?: Date;
  }

  interface GoogleTrends {
    relatedQueries(options: RelatedQueriesOptions): Promise<string>;
  }

  const googleTrends: GoogleTrends;
  export default googleTrends;
}
