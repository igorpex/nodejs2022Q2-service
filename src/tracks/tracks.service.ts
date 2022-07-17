import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { Track } from './entities/track.entity';
import { v4 as uuid, validate, version } from 'uuid';

@Injectable()
export class TracksService {
  private tracks: Array<Track> = [];
  create(createTrackDto: CreateTrackDto) {
    // return 'This action adds a new track';
    //check required fields and types
    const hasAllRequiredFields = createTrackDto.name && createTrackDto.duration;
    const hasCorrectTypes =
      typeof createTrackDto.name === 'string' &&
      typeof createTrackDto.duration === 'number';

    if (!hasAllRequiredFields || !hasCorrectTypes) {
      throw new BadRequestException(
        `request body does not contain required fields. name should be string, duration should be integer number`,
      );
    }

    // create a track with random id
    const newTrack = {
      id: uuid(),
      ...createTrackDto,
    };
    this.tracks.push(newTrack);
    return newTrack;
  }

  findAll() {
    // return `This action returns all tracks`;
    return this.tracks;
  }

  findOne(id: string) {
    // return `This action returns a #${id} track`;
    if (!validate(id) || !(version(id) === 4)) {
      throw new BadRequestException(`trackId ${id} is invalid (not uuid)`);
    }

    // Check track exists
    const track: Track = this.tracks.find((track) => track.id === id);
    if (!track) {
      throw new NotFoundException('Track not found.');
    }
    return track;
  }

  update(id: string, updateTrackDto: UpdateTrackDto) {
    // return `This action updates a #${id} track`;
    // check uuid is valid or return error
    if (!validate(id) || !(version(id) === 4)) {
      throw new BadRequestException(`trackId ${id} is invalid (not uuid)`); //400
    }
    // Check track exists
    const index: number = this.tracks.findIndex((track) => track.id === id);
    // const track: Track = this.tracks.find((track) => track.id === id);
    if (index === -1) {
      throw new NotFoundException('Track not found.'); //404
    }

    //create updated track
    const updatedTrack = {
      id: id,
      ...updateTrackDto,
    };
    this.tracks[index] = updatedTrack;
    return updatedTrack;
  }

  remove(id: string) {
    // return `This action removes a #${id} track`;
    // check uuid is valid or return error
    if (!validate(id) || !(version(id) === 4)) {
      throw new BadRequestException(`trackId ${id} is invalid (not uuid)`); //400
    }
    // Check track exists
    const track: Track = this.tracks.find((track) => track.id === id);
    if (!track) {
      throw new NotFoundException('Track not found.'); //404
    }
    this.tracks = this.tracks.filter((track) => track.id !== id);
    return;
  }
}
