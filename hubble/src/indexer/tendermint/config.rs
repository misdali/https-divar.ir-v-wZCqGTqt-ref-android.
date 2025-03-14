use color_eyre::eyre::Report;
use regex::Regex;
use sqlx::PgPool;
use url::Url;

use crate::indexer::{
    api::{BlockHeight, IndexerId},
    tendermint::{context::TmContext, fetcher_client::TmFetcherClient},
    FinalizerConfig, Indexer,
};

const DEFAULT_CHUNK_SIZE: usize = 20;
const DEFAULT_TRANSACTIONS_MAX_PAGE_SIZE: u8 = 100;
const DEFAULT_CLIENT_TRACKING: bool = true;

#[derive(Clone, Debug, serde::Deserialize)]
pub struct Config {
    pub indexer_id: IndexerId,
    pub start_height: BlockHeight,
    pub chunk_size: Option<usize>,
    pub rpc_urls: Vec<Url>,
    pub grpc_urls: Vec<Url>,
    pub filter: Option<String>,
    pub tx_search_max_page_size: Option<u8>,
    #[serde(default)]
    pub finalizer: FinalizerConfig,
    pub client_tracking: Option<bool>,
}

impl Config {
    pub async fn build(self, pg_pool: PgPool) -> Result<Indexer<TmFetcherClient>, Report> {
        Ok(Indexer::new(
            pg_pool,
            self.indexer_id,
            self.start_height,
            self.chunk_size.unwrap_or(DEFAULT_CHUNK_SIZE),
            self.finalizer,
            TmContext {
                rpc_urls: self.rpc_urls,
                grpc_urls: self.grpc_urls,
                filter: self
                    .filter
                    .map(|regex| Regex::new(regex.as_str()).expect("valid filter regex")),
                tx_search_max_page_size: self
                    .tx_search_max_page_size
                    .unwrap_or(DEFAULT_TRANSACTIONS_MAX_PAGE_SIZE),
                client_tracking: self.client_tracking.unwrap_or(DEFAULT_CLIENT_TRACKING),
            },
        ))
    }
}
