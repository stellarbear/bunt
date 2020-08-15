import HelloWorldRoute from "../../../test/src/actions/HelloWorldRoute";

test("Route", async () => {
    expect(HelloWorldRoute).toMatchSnapshot();
});
