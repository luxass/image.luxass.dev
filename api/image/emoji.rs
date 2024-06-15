use image_service::choose_starter;
use og_image_writer::{style, writer::OGImageWriter};
use serde_json::json;
use vercel_runtime::{run, Body, Error, Request, Response, StatusCode};

#[tokio::main]
async fn main() -> Result<(), Error> {
    run(handler).await
}

pub async fn handler(_req: Request) -> Result<Response<Body>, Error> {
    let starter = choose_starter();
    let text = "Generated by Rust!";

    let mut writer = OGImageWriter::new(style::WindowStyle {
        width: 1024,
        height: 512,
        background_color: Some(style::Rgba([70, 40, 90, 255])),
        align_items: style::AlignItems::Center,
        justify_content: style::JustifyContent::Center,
        ..style::WindowStyle::default()
    })?;

    let font = Vec::from(include_bytes!("../../fonts/Inter.ttf") as &[u8]);

    writer.set_text(
        text,
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
