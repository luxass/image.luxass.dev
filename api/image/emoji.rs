use garde::Validate;
use og_image_writer::{style, writer::OGImageWriter};
use serde::{Deserialize, Serialize};
use serde_json::json;
use tailwind_css::{TailwindBackgroundColor, TailwindColor};
use vercel_runtime::{run, Body, Error, Request, Response, StatusCode};

const DEFAULT_WIDTH: u16 = 300;
const DEFAULT_HEIGHT: u16 = 300;

#[derive(Debug, Serialize, Deserialize, Validate)]
struct EmojiQueryParams {
    #[garde(range(min = 300, max = 1200))]
    width: Option<u16>,

    #[garde(range(min = 300, max = 1200))]
    height: Option<u16>,

    #[garde(ascii)]
    bg_color: Option<String>,
}

impl Default for EmojiQueryParams {
    fn default() -> Self {
        EmojiQueryParams {
            width: Some(DEFAULT_WIDTH),
            height: Some(DEFAULT_HEIGHT),
            bg_color: Some("704090".to_string()),
        }
    }
}

#[tokio::main]
async fn main() -> Result<(), Error> {
    run(handler).await
}

pub async fn handler(req: Request) -> Result<Response<Body>, Error> {
    let query_params: Result<EmojiQueryParams, _> = match req.uri().query() {
        Some(params) => {
            let mut query_params: EmojiQueryParams = serde_urlencoded::from_str(params)?;
            println!("2 {:?}", query_params);
            query_params.width.get_or_insert(DEFAULT_WIDTH);
            query_params.height.get_or_insert(DEFAULT_HEIGHT);
            query_params.validate()?; // Validate the query parameters
            Ok(query_params)
        }
        None => Ok(EmojiQueryParams::default()),
    };

    match query_params {
        Ok(params) => {
            println!("{:?}", query_params);

            let emojis = vec![
                "😊",
                "🚀",
                "⭐",
                "🔧",
                "🎉",
                "🔍",
                "📚",
                "🔥",
                "👨‍💻",
                "🔄",
                "🚦",
                "🤔",
                "💡",
                "👍",
                "🌍",
                "💡",
                "🤖",
            ];

            let mut writer = OGImageWriter::new(style::WindowStyle {
                width: query_params.un.unwrap_or(DEFAULT_WIDTH) as u32,
                height: query_params.height.unwrap_or(DEFAULT_HEIGHT) as u32,
                background_color: Some(style::Rgba([70, 40, 90, 255])),
                align_items: style::AlignItems::Center,
                justify_content: style::JustifyContent::Center,
                ..style::WindowStyle::default()
            })?;

            let font = Vec::from(include_bytes!("../../fonts/Inter.ttf") as &[u8]);

            writer.set_text(
                "Hello, World!",
                style::Style {
                    margin: style::Margin(0, 20, 0, 20),
                    line_height: 1.8,
                    font_size: 100.,
                    white_space: style::WhiteSpace::PreLine,
                    color: style::Rgba([255, 255, 255, 255]),
                    text_align: style::TextAlign::Center,
                    ..style::Style::default()
                },
                Some(font.clone()),
            )?;

            writer.paint()?;

            let image = writer.encode(og_image_writer::ImageOutputFormat::Png)?;

            Ok(Response::builder()
                .status(StatusCode::OK)
                .header("Cache-Control", "public, s-maxage=3600")
                .header("Content-Type", "image/png")
                .body(image.into())?)
        }
        Err(e) => {
            let error_message = format!("Invalid query parameters: {}", e);
            let response = Response::builder()
                .status(StatusCode::BAD_REQUEST)
                .header("Content-Type", "application/json")
                .body(Body::from(json!({ "error": error_message }).to_string()))?;
            // Err(Error::from(response))
            Ok(response)
        }
    }
}
