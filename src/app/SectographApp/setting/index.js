AppSettingsPage({
  build(props) {
    return View(
      {
        style: {
          display: "flex",
          justifyContent: "center",
          background: "rgb(248, 78, 63)",
        },
      },
      [
        Text(
          {
            style: {
              color: "#666",
              fontSize: "40px",
            },
          },
          "Test Text - Can you see me?"
        ),
      ]
    );
  },
});