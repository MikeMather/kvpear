const { faker } = require("@faker-js/faker");

function generateVars(ctx, ee, next) {
  const keyName = faker.word.noun();
  ctx.vars["bucket"] = `TEST_${faker.word.noun()}`;
  ctx.vars["keyName"] = `TEST_${keyName}`;
  ctx.vars["value"] = `TEST_${faker.number.bigInt()}`;
  ctx.vars["keyNamePrefix"] = `TEST_${keyName.substring(0, 3)}`;

  return next();
}

module.exports = {
  generateVars,
};

