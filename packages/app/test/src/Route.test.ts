import HelloWorldRoute from "./action/HelloWorldRoute";

test("Route", async () => {
    expect(HelloWorldRoute).toMatchSnapshot();
});
