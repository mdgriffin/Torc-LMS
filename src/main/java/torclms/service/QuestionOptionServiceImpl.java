package torclms.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import torclms.model.QuestionOption;
import torclms.repository.QuestionOptionRepository;

@Service
public class QuestionOptionServiceImpl  implements  QuestionOptionService {

    @Autowired
    QuestionOptionRepository optionRepo;

    public QuestionOption saveOption (QuestionOption option) {
        return optionRepo.save(option);
    }
}
