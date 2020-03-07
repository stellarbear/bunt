import HelloWorldRoute from "./src/actions/HelloWorldRoute";

test("Route", async () => {
    expect(HelloWorldRoute).toMatchSnapshot();
});
