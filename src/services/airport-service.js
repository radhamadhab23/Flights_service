const { StatusCodes } = require('http-status-codes');

const { AirportRepository } = require('../repositories');
const AppError = require('../utils/errors/app-error');

const airportRepository = new AirportRepository();

async function createAirport(data) {
    try {
        const airport = await airportRepository.create(data);
        return airport;
    } catch (error) {
        console.error('🔥 Sequelize/DB Error in createAirport:', error); // Log the actual error

        if (error.name === 'SequelizeValidationError') {
            let explanation = [];
            error.errors.forEach((err) => {
                explanation.push(err.message);
            });
            throw new AppError(explanation, StatusCodes.BAD_REQUEST);
        }

        throw new AppError('Cannot create a new Airport object', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function getAirports() {
    try {
        const airports = await airportRepository.getAll();
        return airports;
    } catch (error) {
        console.error('🔥 Error in getAirports:', error);
        throw new AppError('Cannot fetch data of all the airports', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function getAirport(id) {
    try {
        const airport = await airportRepository.get(id);
        return airport;
    } catch (error) {
        console.error('🔥 Error in getAirport:', error);

        if (error.statusCode === StatusCodes.NOT_FOUND) {
            throw new AppError('The airport you requested is not present', error.statusCode);
        }

        throw new AppError('Cannot fetch airport data', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function destroyAirport(id) {
    try {
        const response = await airportRepository.destroy(id);
        return response;
    } catch (error) {
        console.error('🔥 Error in destroyAirport:', error);

        if (error.statusCode === StatusCodes.NOT_FOUND) {
            throw new AppError('The airport you requested to delete is not present', error.statusCode);
        }

        throw new AppError('Cannot delete airport', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function updateAirport(id, data) {
    try {
        const response = await airportRepository.update(id, data);
        return response;
    } catch (error) {
        console.error('🔥 Error in updateAirport:', error);

        if (error.statusCode === StatusCodes.NOT_FOUND) {
            throw new AppError('The airport you requested to update is not present', error.statusCode);
        }

        throw new AppError('Cannot update airport', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

module.exports = {
    createAirport,
    getAirports,
    getAirport,
    destroyAirport,
    updateAirport
};
